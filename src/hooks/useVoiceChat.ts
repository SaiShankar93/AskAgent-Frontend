'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'muted';

export interface VoiceTurn {
    id: string;
    role: 'user' | 'assistant';
    text: string;
}

interface UseVoiceChatOptions {
    agentId: string | null;
    isWidget?: boolean;
    onSessionEnd?: () => void;
}

// Self-contained Speech Recognition types — avoids conflicts with whatever
// version of lib.dom.d.ts the TypeScript installation has.

interface SpeechRecogResult extends Event {
    readonly resultIndex: number;
    readonly results: {
        readonly length: number;
        [i: number]: {
            readonly isFinal: boolean;
            readonly length: number;
            [j: number]: { readonly transcript: string };
        };
    };
}

interface SpeechRecognitionInstance {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: ((event: SpeechRecogResult) => void) | null;
    onend:    (() => void) | null;
    onerror:  ((event: { error: string }) => void) | null;
}

export function useVoiceChat({ agentId, isWidget = false, onSessionEnd }: UseVoiceChatOptions) {
    const { getToken } = useAuth();

    const [voiceState, setVoiceState]   = useState<VoiceState>('idle');
    const [turns, setTurns]             = useState<VoiceTurn[]>([]);
    const [interimText, setInterimText] = useState('');
    const [error, setError]             = useState<string | null>(null);

    // Stable refs so recognition callbacks never go stale
    const recognitionRef  = useRef<SpeechRecognitionInstance | null>(null);
    const audioRef        = useRef<HTMLAudioElement | null>(null);
    const audioUrlRef     = useRef<string | null>(null);
    const voiceStateRef   = useRef<VoiceState>('idle');
    const agentIdRef      = useRef(agentId);
    const isWidgetRef     = useRef(isWidget);
    const getTokenRef     = useRef(getToken);

    // Keep refs in sync every render
    voiceStateRef.current = voiceState;
    agentIdRef.current    = agentId;
    isWidgetRef.current   = isWidget;
    getTokenRef.current   = getToken;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = typeof window !== 'undefined' ? (window as any) : null;
    const isSupported = !!(w?.SpeechRecognition || w?.webkitSpeechRecognition);

    // ── Audio helpers ─────────────────────────────────────────────────────
    const cleanupAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.onended = null;
            audioRef.current.onerror = null;
            audioRef.current = null;
        }
        if (audioUrlRef.current) {
            URL.revokeObjectURL(audioUrlRef.current);
            audioUrlRef.current = null;
        }
    };

    const restartListening = () => {
        if (!recognitionRef.current) return;
        setVoiceState('listening');
        try { recognitionRef.current.start(); } catch { /* already started */ }
    };

    // ── Text-to-speech ────────────────────────────────────────────────────
    const speakText = async (text: string) => {
        setVoiceState('speaking');
        cleanupAudio();

        try {
            const token    = isWidgetRef.current ? null : await getTokenRef.current();
            const endpoint = isWidgetRef.current
                ? `${API_BASE}/chat/widget-tts`
                : `${API_BASE}/chat/tts`;

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ text }),
            });

            if (!res.ok) throw new Error(`TTS request failed: ${res.status}`);

            const blob = await res.blob();
            const url  = URL.createObjectURL(blob);
            audioUrlRef.current = url;

            const audio = new Audio(url);
            audioRef.current = audio;

            audio.onended = () => {
                cleanupAudio();
                // After playback, resume listening (unless the session was ended/muted)
                if (voiceStateRef.current === 'speaking') restartListening();
            };
            audio.onerror = () => {
                cleanupAudio();
                if (voiceStateRef.current === 'speaking') restartListening();
            };

            await audio.play();
        } catch (err) {
            console.error('[VoiceChat] TTS error:', err);
            setError('Could not play voice response.');
            if (voiceStateRef.current === 'speaking') restartListening();
        }
    };

    // ── LLM call ──────────────────────────────────────────────────────────
    const processUserSpeech = async (text: string) => {
        const currentAgentId = agentIdRef.current;
        if (!currentAgentId || !text.trim()) return;

        setVoiceState('processing');
        setInterimText('');
        setTurns(prev => [...prev, { id: `u-${Date.now()}`, role: 'user', text }]);

        try {
            const isWid    = isWidgetRef.current;
            const token    = isWid ? null : await getTokenRef.current();
            const endpoint = isWid ? `${API_BASE}/chat/widget` : `${API_BASE}/chat/send`;

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ agentId: currentAgentId, content: text }),
            });

            const data = await res.json();
            const assistantText: string = isWid
                ? (data?.data?.content          || 'Sorry, I could not respond.')
                : (data?.data?.assistantMessage?.content || 'Sorry, I could not respond.');

            setTurns(prev => [...prev, { id: `a-${Date.now()}`, role: 'assistant', text: assistantText }]);
            await speakText(assistantText);
        } catch (err) {
            console.error('[VoiceChat] Pipeline error:', err);
            setError('Failed to get a response. Please try again.');
            restartListening();
        }
    };

    // ── Web Speech Recognition setup ─────────────────────────────────────
    const initRecognition = (): SpeechRecognitionInstance | null => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const win = window as any;
        const SpeechAPI: (new () => SpeechRecognitionInstance) | undefined =
            win.SpeechRecognition || win.webkitSpeechRecognition;
        if (!SpeechAPI) return null;

        const rec = new SpeechAPI();
        rec.continuous      = false;   // one utterance at a time; we restart manually
        rec.interimResults  = true;
        rec.lang            = 'en-US';
        rec.maxAlternatives = 1;

        rec.onresult = (event: SpeechRecogResult) => {
            let interim = '';
            let final   = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) final += transcript;
                else interim += transcript;
            }

            setInterimText(final || interim);

            if (final.trim()) {
                rec.stop();
                processUserSpeech(final.trim());
            }
        };

        rec.onend = () => {
            // Chrome stops recognition after ~5s of silence — auto-restart when still listening
            if (voiceStateRef.current === 'listening') {
                try { rec.start(); } catch { /* race condition, ignore */ }
            }
        };

        rec.onerror = (event) => {
            if (event.error === 'no-speech') {
                // Expected in silence — just restart
                if (voiceStateRef.current === 'listening') {
                    try { rec.start(); } catch { /* ignore */ }
                }
            } else if (event.error !== 'aborted') {
                console.warn('[VoiceChat] Recognition error:', event.error);
                if (event.error === 'not-allowed') {
                    setError('Microphone permission denied. Please allow access and try again.');
                }
            }
        };

        return rec;
    };

    // ── Public API ────────────────────────────────────────────────────────
    const start = () => {
        if (!isSupported || !agentId) return;
        setError(null);
        setTurns([]);
        setInterimText('');

        if (!recognitionRef.current) {
            recognitionRef.current = initRecognition();
        }
        if (!recognitionRef.current) return;

        setVoiceState('listening');
        try { recognitionRef.current.start(); } catch { /* already running */ }
    };

    const mute = () => {
        recognitionRef.current?.abort();
        cleanupAudio();
        setVoiceState('muted');
        setInterimText('');
    };

    const unmute = () => {
        if (!recognitionRef.current || voiceStateRef.current !== 'muted') return;
        setVoiceState('listening');
        try { recognitionRef.current.start(); } catch { /* ignore */ }
    };

    const end = () => {
        recognitionRef.current?.abort();
        recognitionRef.current = null;
        cleanupAudio();
        setVoiceState('idle');
        setTurns([]);
        setInterimText('');
        setError(null);
        onSessionEnd?.();
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            recognitionRef.current?.abort();
            cleanupAudio();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { voiceState, turns, interimText, error, isSupported, start, mute, unmute, end };
}
