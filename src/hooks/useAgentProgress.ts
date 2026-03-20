'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface ProgressEvent {
    agentId:    string;
    stage:      'QUEUED' | 'CRAWLING' | 'PARSING' | 'CHUNKING' | 'EMBEDDING' | 'STORING' | 'MEMORY' | 'DONE' | 'FAILED';
    label:      string;
    pct:        number;
    timestamp:  string;
    // optional extras
    pageCount?:     number;
    totalPages?:    number;
    chunkCount?:    number;
    embeddingCount?: number;
    error?:     string;
}

export interface PageScrapedEvent {
    agentId:   string;
    url:       string;
    title:     string;
    wordCount: number;
    pageIndex: number;
    timestamp: string;
}

interface UseAgentProgressOptions {
    agentId:  string | null;
    enabled?: boolean;          // only connect when true
    onDone?:  () => void;       // called when stage === 'DONE'
    onFailed?: (error: string) => void;
}

export function useAgentProgress({ agentId, enabled = true, onDone, onFailed }: UseAgentProgressOptions) {
    const socketRef  = useRef<Socket | null>(null);
    const [progress, setProgress]   = useState<ProgressEvent | null>(null);
    const [pages, setPages]         = useState<PageScrapedEvent[]>([]);
    const [connected, setConnected] = useState(false);

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        setConnected(false);
    }, []);

    useEffect(() => {
        if (!agentId || !enabled) {
            disconnect();
            return;
        }

        const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

        const socket = io(apiBase, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setConnected(true);
            socket.emit('join:agent', agentId);
            console.log(`[Socket] Connected, joined room agent:${agentId}`);
        });

        socket.on('disconnect', () => setConnected(false));

        socket.on('agent:progress', (event: ProgressEvent) => {
            setProgress(event);
            if (event.stage === 'DONE') {
                onDone?.();
                // leave the room
                socket.emit('leave:agent', agentId);
            }
            if (event.stage === 'FAILED') {
                onFailed?.(event.error || 'Unknown error');
                socket.emit('leave:agent', agentId);
            }
        });

        socket.on('agent:page-scraped', (event: PageScrapedEvent) => {
            setPages(prev => [...prev, event]);
        });

        return () => {
            socket.emit('leave:agent', agentId);
            socket.disconnect();
            socketRef.current = null;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [agentId, enabled]);

    const reset = useCallback(() => {
        setProgress(null);
        setPages([]);
    }, []);

    return { progress, pages, connected, disconnect, reset };
}
