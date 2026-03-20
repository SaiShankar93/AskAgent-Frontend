'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, FileText, Loader2, CheckCircle2, XCircle, Wifi, WifiOff, ExternalLink } from 'lucide-react';
import { useAgentProgress, ProgressEvent, PageScrapedEvent } from '@/hooks/useAgentProgress';

// ─── Stage metadata ───────────────────────────────────────────────────────
const STAGES: Record<string, { label: string; color: string }> = {
    QUEUED:    { label: 'Queued',              color: 'text-gray-400' },
    CRAWLING:  { label: 'Crawling pages',      color: 'text-indigo-400' },
    PARSING:   { label: 'Parsing document',    color: 'text-indigo-400' },
    CHUNKING:  { label: 'Splitting content',   color: 'text-violet-400' },
    EMBEDDING: { label: 'Generating embeddings', color: 'text-purple-400' },
    STORING:   { label: 'Storing vectors',     color: 'text-fuchsia-400' },
    MEMORY:    { label: 'Building memory',     color: 'text-pink-400' },
    DONE:      { label: 'Ready!',              color: 'text-emerald-400' },
    FAILED:    { label: 'Failed',              color: 'text-red-400' },
};

// ─── Component ────────────────────────────────────────────────────────────
interface AgentProgressPanelProps {
    agentId:   string;
    agentName: string;
    agentType: 'website' | 'document';
    onReady:   () => void;   // called when ingestion finishes — switches to chat
}

export default function AgentProgressPanel({ agentId, agentName, agentType, onReady }: AgentProgressPanelProps) {
    const pagesEndRef = useRef<HTMLDivElement>(null);

    const { progress, pages, connected } = useAgentProgress({
        agentId,
        enabled:  true,
        onDone:   onReady,
        onFailed: (err) => console.error('[Progress] Ingestion failed:', err),
    });

    // Auto-scroll page list
    useEffect(() => {
        pagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [pages]);

    const isDone   = progress?.stage === 'DONE';
    const isFailed = progress?.stage === 'FAILED';
    const pct      = Math.max(0, progress?.pct ?? 0);

    const stageInfo = STAGES[progress?.stage ?? 'QUEUED'];
    const AgentIcon = agentType === 'website' ? Globe : FileText;

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-transparent">

            {/* ── Header card ─────────────────────────────────────────── */}
            <div className="px-6 py-8 flex flex-col items-center gap-4">

                {/* Agent avatar + animated ring */}
                <div className="relative">
                    <motion.div
                        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 blur-xl"
                        animate={isDone ? { scale: [1, 1.4, 1], opacity: [0.5, 0.8, 0] } : { scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: isDone ? 0.8 : 2.5, repeat: isDone ? 0 : Infinity, ease: 'easeInOut' }}
                    />
                    <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
                        {isDone ? (
                            <CheckCircle2 className="h-10 w-10 text-white" />
                        ) : isFailed ? (
                            <XCircle className="h-10 w-10 text-white" />
                        ) : (
                            <AgentIcon className="h-10 w-10 text-white" />
                        )}
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{agentName}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {isDone
                            ? 'Agent is ready to chat!'
                            : isFailed
                            ? 'Something went wrong during ingestion'
                            : 'Setting up your AI agent...'}
                    </p>
                </div>

                {/* Socket connection indicator */}
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    {connected
                        ? <><Wifi className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">Live updates connected</span></>
                        : <><WifiOff className="w-3 h-3" /><span>Connecting...</span></>
                    }
                </div>
            </div>

            {/* ── Progress bar ─────────────────────────────────────────── */}
            <div className="px-6 pb-4">
                <div className="flex items-center justify-between text-xs font-medium mb-2">
                    <span className={stageInfo.color}>{progress?.label || 'Waiting to start...'}</span>
                    <span className="text-gray-400">{pct}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-white/[0.06] overflow-hidden">
                    <motion.div
                        className={`h-full rounded-full ${isFailed
                            ? 'bg-red-500'
                            : isDone
                            ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                            : 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500'
                        }`}
                        initial={{ width: '0%' }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>
            </div>

            {/* ── Page / step feed ─────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-2">

                {/* Website mode — show each page scraped */}
                {agentType === 'website' && pages.length > 0 && (
                    <>
                        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                            Pages scraped ({pages.length})
                        </p>
                        <AnimatePresence mode="popLayout">
                            {pages.map((page, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                                    className="flex items-start gap-3 p-3 rounded-xl bg-white/60 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05]"
                                >
                                    <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center mt-0.5">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{page.title || page.url}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <a
                                                href={page.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[11px] text-indigo-500 dark:text-indigo-400 hover:underline flex items-center gap-0.5 truncate max-w-[200px]"
                                            >
                                                {page.url} <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                                            </a>
                                            {page.wordCount > 0 && (
                                                <span className="text-[11px] text-gray-400 dark:text-gray-500 flex-shrink-0">
                                                    {page.wordCount.toLocaleString()} words
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={pagesEndRef} />
                    </>
                )}

                {/* Document mode — show stage progress messages */}
                {agentType === 'document' && progress && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/60 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05]">
                        {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        ) : (
                            <Loader2 className="w-5 h-5 text-indigo-400 flex-shrink-0 animate-spin" />
                        )}
                        <p className="text-sm text-gray-700 dark:text-gray-300">{progress.label}</p>
                    </div>
                )}

                {/* Empty / waiting */}
                {pages.length === 0 && !progress && (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                        >
                            <Loader2 className="w-8 h-8 text-indigo-400" />
                        </motion.div>
                        <p className="text-sm text-gray-400">Waiting for pipeline to start...</p>
                    </div>
                )}

                {/* Failed state */}
                {isFailed && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/[0.06] border border-red-200/50 dark:border-red-500/20">
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-red-600 dark:text-red-400">Ingestion failed</p>
                            <p className="text-xs text-red-500/80 dark:text-red-400/70 mt-0.5">{progress?.error || 'An unexpected error occurred.'}</p>
                        </div>
                    </div>
                )}

                {/* Done state CTA */}
                {isDone && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-3 py-6"
                    >
                        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-5 h-5" />
                            {progress?.embeddingCount?.toLocaleString()} vectors stored
                            {progress?.totalPages && ` · ${progress.totalPages} pages`}
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={onReady}
                            className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow"
                        >
                            Start chatting →
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
