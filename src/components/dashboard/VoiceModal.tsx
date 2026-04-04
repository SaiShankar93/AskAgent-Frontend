'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, PhoneOff, AlertCircle } from 'lucide-react';
import { VoiceState, VoiceTurn } from '@/hooks/useVoiceChat';

// Bar heights (%) for the waveform — fixed so there's no SSR / random re-render issue
const WAVE_SCALES = [0.4, 0.75, 1.0, 0.65, 0.9, 0.55, 0.4];

function VoiceWaveform({ voiceState }: { voiceState: VoiceState }) {
    const isActive   = voiceState === 'listening';
    const isSpeaking = voiceState === 'speaking';
    const isThinking = voiceState === 'processing';
    const animating  = isActive || isSpeaking || isThinking;

    return (
        <div className="flex items-center justify-center gap-1.5 h-14">
            {WAVE_SCALES.map((scale, i) => (
                <motion.div
                    key={i}
                    className={`w-1.5 rounded-full ${
                        isSpeaking ? 'bg-indigo-400' :
                        isThinking ? 'bg-violet-400' :
                        isActive   ? 'bg-violet-400' :
                                     'bg-gray-700'
                    }`}
                    animate={animating ? {
                        scaleY: [0.3, scale, 0.3],
                        opacity: [0.6, 1, 0.6],
                    } : { scaleY: 0.25, opacity: 0.4 }}
                    transition={animating ? {
                        duration: isThinking ? 1.0 : 0.7,
                        repeat: Infinity,
                        delay: i * 0.08,
                        ease: 'easeInOut',
                    } : { duration: 0.3 }}
                    style={{ height: 48, transformOrigin: 'center' }}
                />
            ))}
        </div>
    );
}

const STATUS_LABEL: Record<VoiceState, string> = {
    idle:       '',
    listening:  'Listening…',
    processing: 'Thinking…',
    speaking:   'Speaking…',
    muted:      'Muted — tap mic to resume',
};

interface VoiceModalProps {
    agentName: string;
    voiceState: VoiceState;
    turns: VoiceTurn[];
    interimText: string;
    error: string | null;
    onMute: () => void;
    onUnmute: () => void;
    onEnd: () => void;
}

export default function VoiceModal({
    agentName, voiceState, turns, interimText, error, onMute, onUnmute, onEnd,
}: VoiceModalProps) {
    const transcriptEndRef = useRef<HTMLDivElement>(null);
    const isMuted = voiceState === 'muted';

    // Auto-scroll transcript
    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [turns, interimText, voiceState]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-gray-950 text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <span className="text-xs font-bold text-white">
                            {agentName.substring(0, 2).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">{agentName}</p>
                        <p className="text-xs text-gray-500">Voice Mode</p>
                    </div>
                </div>

                {/* Live status badge */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={voiceState}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.15 }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                            voiceState === 'listening'  ? 'bg-violet-500/20 text-violet-300' :
                            voiceState === 'processing' ? 'bg-indigo-500/20 text-indigo-300' :
                            voiceState === 'speaking'   ? 'bg-blue-500/20 text-blue-300' :
                            voiceState === 'muted'      ? 'bg-gray-500/20 text-gray-400' :
                                                          'bg-gray-800 text-gray-500'
                        }`}
                    >
                        {voiceState !== 'muted' && voiceState !== 'idle' && (
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                            </span>
                        )}
                        {STATUS_LABEL[voiceState]}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Transcript ──────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                {/* Empty state */}
                {turns.length === 0 && voiceState === 'listening' && !interimText && (
                    <motion.div
                        className="flex flex-col items-center justify-center h-full gap-3 pb-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <p className="text-gray-600 text-sm">Start speaking to begin the conversation.</p>
                    </motion.div>
                )}

                {/* Conversation turns */}
                <AnimatePresence initial={false}>
                    {turns.map((turn) => (
                        <motion.div
                            key={turn.id}
                            className={`flex ${turn.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            initial={{ opacity: 0, y: 10, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div
                                className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                    turn.role === 'user'
                                        ? 'bg-amber-500 text-white rounded-tr-sm'
                                        : 'bg-white/[0.07] text-gray-200 rounded-tl-sm border border-white/[0.07]'
                                }`}
                            >
                                {turn.text}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Interim (in-progress user speech) */}
                <AnimatePresence>
                    {interimText && voiceState === 'listening' && (
                        <motion.div
                            className="flex justify-end"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                        >
                            <div className="max-w-[78%] px-4 py-3 rounded-2xl rounded-tr-sm bg-amber-500/30 text-amber-300 text-sm italic border border-amber-500/20">
                                {interimText}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Thinking dots */}
                <AnimatePresence>
                    {voiceState === 'processing' && (
                        <motion.div
                            className="flex justify-start"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                        >
                            <div className="px-4 py-4 rounded-2xl rounded-tl-sm bg-white/[0.07] border border-white/[0.07] flex gap-1.5 items-center">
                                {[0, 1, 2].map(i => (
                                    <motion.div
                                        key={i}
                                        className="w-2 h-2 bg-indigo-400 rounded-full"
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            className="flex justify-center"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="flex items-center gap-2 px-4 py-2.5 bg-red-500/15 text-red-400 text-sm rounded-xl border border-red-500/20">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div ref={transcriptEndRef} />
            </div>

            {/* ── Waveform + Status ───────────────────────────────────────── */}
            <div className="flex flex-col items-center gap-2 py-4">
                <VoiceWaveform voiceState={voiceState} />
                <AnimatePresence mode="wait">
                    <motion.p
                        key={voiceState}
                        className="text-xs text-gray-500 h-4"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                    >
                        {STATUS_LABEL[voiceState]}
                    </motion.p>
                </AnimatePresence>
            </div>

            {/* ── Controls ────────────────────────────────────────────────── */}
            <div className="flex items-center justify-center gap-5 pb-10 pt-2">
                {/* Mute / Unmute */}
                <motion.button
                    onClick={isMuted ? onUnmute : onMute}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.93 }}
                    title={isMuted ? 'Unmute' : 'Mute'}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                        isMuted
                            ? 'bg-red-500/20 text-red-400 ring-2 ring-red-500/30 hover:bg-red-500/30'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </motion.button>

                {/* End call */}
                <motion.button
                    onClick={onEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.93 }}
                    className="flex items-center gap-2 px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-lg shadow-red-600/30 transition-colors"
                >
                    <PhoneOff className="w-5 h-5" />
                    End
                </motion.button>
            </div>
        </motion.div>
    );
}
