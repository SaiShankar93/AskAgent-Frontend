'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Bot, User, Loader2, AlertCircle, Sparkles, Code, X, Copy, Check, Trash2, Plus, Upload, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@/hooks/useChat';
import { useAgents } from '@/hooks/useAgents';
import { getEmbedCode as getEmbedCodeTemplate, Framework } from './embedCodeTemplates';

interface ChatPanelProps {
    agentId: string | null;
    agentName?: string;
    agentType?: 'website' | 'document';
    onDeleteAgent?: () => Promise<void>;
}

// Simple time formatter
const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
};

const featureItems = [
    { icon: Code, label: 'Website', gradient: 'from-indigo-500 to-violet-500', shadow: 'shadow-indigo-500/25' },
    { icon: Sparkles, label: 'Documents', gradient: 'from-violet-500 to-purple-500', shadow: 'shadow-violet-500/25' },
    { icon: Bot, label: 'AI Chat', gradient: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/25' },
];

export default function ChatPanel({ agentId, agentName, agentType, onDeleteAgent }: ChatPanelProps) {
    const [inputMessage, setInputMessage] = useState('');
    const [showEmbedModal, setShowEmbedModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddContextModal, setShowAddContextModal] = useState(false);
    const [addContextFile, setAddContextFile] = useState<File | null>(null);
    const [addContextStatus, setAddContextStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedFramework, setSelectedFramework] = useState<Framework>('react');
    const [copiedCode, setCopiedCode] = useState(false);
    const addContextInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const { addContext } = useAgents();

    const { messages, loading, sending, error, fetchHistory, sendMessage } = useChat(agentId);

    // Fetch chat history when agent changes
    useEffect(() => {
        if (agentId) {
            fetchHistory();
        }
    }, [agentId, fetchHistory]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    const getEmbedCode = () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        return getEmbedCodeTemplate(selectedFramework, { agentId, agentName, apiUrl });
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!inputMessage.trim() || !agentId || sending) return;

        const messageContent = inputMessage.trim();
        setInputMessage('');

        // Send message with RAG
        await sendMessage(messageContent);

        // Focus back on input
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    // ─── No Agent Selected ───────────────────────────────────────────────
    if (!agentId) {
        return (
            <div className="h-full flex items-center justify-center bg-transparent">
                <motion.div
                    className="text-center px-4 max-w-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Animated Bot Icon */}
                    <div className="relative mx-auto mb-8 w-28 h-28">
                        {/* Outer glow ring */}
                        <motion.div
                            className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 blur-xl"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div
                            className="relative w-28 h-28 bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30"
                            animate={{
                                rotate: [0, 3, 0, -3, 0],
                                scale: [1, 1.04, 1],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            <Bot className="h-14 w-14 text-white" />
                        </motion.div>
                    </div>

                    <motion.h3
                        className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.5 }}
                    >
                        Welcome to AskAgent
                    </motion.h3>
                    <motion.p
                        className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-lg leading-relaxed"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.5 }}
                    >
                        Select an agent from the sidebar to start a conversation, or create a new one to get started.
                    </motion.p>

                    {/* Feature Icons */}
                    <motion.div
                        className="mt-10 flex items-center justify-center gap-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        {featureItems.map((feature, index) => (
                            <motion.div
                                key={feature.label}
                                className="flex flex-col items-center gap-3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                                whileHover={{ y: -4 }}
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg ${feature.shadow}`}>
                                    <feature.icon className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold tracking-wide">
                                    {feature.label}
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    // ─── Main Chat View ──────────────────────────────────────────────────
    return (
        <div className="h-full flex flex-col">
            {/* ── Chat Header ─────────────────────────────────────────── */}
            <motion.div
                className="bg-white/70 dark:bg-gray-950/70 backdrop-blur-2xl border-b border-gray-200/40 dark:border-white/[0.06] px-6 py-4 flex items-center gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* Agent Avatar */}
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-500/25 ring-2 ring-white/20">
                    {agentName?.substring(0, 2).toUpperCase() || 'AI'}
                </div>

                {/* Agent Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate">
                        {agentName || 'AI Agent'}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Online</p>
                    </div>
                </div>

                {/* Embed Button — only for website agents */}
                {agentType !== 'document' && (
                <button
                    onClick={() => setShowEmbedModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 active:scale-[0.97]"
                >
                    <Code className="w-4 h-4" />
                    <span>Embed</span>
                </button>
                )}

                {/* Add Context Button */}
                <button
                    onClick={() => { setAddContextFile(null); setAddContextStatus('idle'); setShowAddContextModal(true); }}
                    className="flex items-center gap-2 px-3 py-2.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white text-sm font-semibold rounded-xl transition-all duration-200 active:scale-[0.97]"
                    title="Add more context / documents"
                >
                    <Plus className="w-4 h-4" />
                </button>

                {/* Delete Button */}
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 px-3 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-sm font-medium rounded-xl transition-all duration-200 active:scale-[0.97]"
                    title="Delete Agent"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </motion.div>

            {/* ── Delete Confirmation Modal ────────────────────────────── */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDeleteModal(false)}
                        />
                        <motion.div
                            className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
                                    <Trash2 className="h-8 w-8 text-red-500" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    Delete Agent?
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-7 leading-relaxed">
                                    This will permanently delete <strong className="text-gray-900 dark:text-white">{agentName}</strong> and all its data. This action cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (onDeleteAgent) {
                                                setIsDeleting(true);
                                                try {
                                                    await onDeleteAgent();
                                                    setShowDeleteModal(false);
                                                } finally {
                                                    setIsDeleting(false);
                                                }
                                            }
                                        }}
                                        disabled={isDeleting}
                                        className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isDeleting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Deleting...
                                            </>
                                        ) : (
                                            'Delete'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Add Context Modal ────────────────────────────────── */}
            <AnimatePresence>
                {showAddContextModal && (
                    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddContextModal(false)} />
                        <motion.div
                            className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                        >
                            <button onClick={() => setShowAddContextModal(false)} className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"><X className="w-4 h-4 text-gray-400" /></button>
                            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
                                <Upload className="h-7 w-7 text-emerald-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 text-center">Add More Context</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center leading-relaxed">Upload a PDF or Word document to expand <strong className="text-gray-700 dark:text-gray-300">{agentName}</strong>'s knowledge base.</p>

                            {addContextStatus === 'done' ? (
                                <div className="text-center py-4">
                                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-3"><Check className="h-6 w-6 text-emerald-500" /></div>
                                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Processing in background!</p>
                                    <p className="text-xs text-gray-400 mt-1">The document will be indexed within a minute.</p>
                                    <button onClick={() => setShowAddContextModal(false)} className="mt-4 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors">Done</button>
                                </div>
                            ) : (
                                <>
                                    <input ref={addContextInputRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={e => setAddContextFile(e.target.files?.[0] ?? null)} />
                                    <button onClick={() => addContextInputRef.current?.click()} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed transition-colors ${addContextFile ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400 bg-gray-50 dark:bg-gray-800/50'}`}>
                                        <FileText className={`w-5 h-5 flex-shrink-0 ${addContextFile ? 'text-emerald-500' : 'text-gray-400'}`} />
                                        <span className={`text-sm truncate ${addContextFile ? 'text-emerald-700 dark:text-emerald-300 font-medium' : 'text-gray-400'}`}>{addContextFile ? addContextFile.name : 'Click to choose PDF / DOCX / TXT'}</span>
                                    </button>
                                    {addContextStatus === 'error' && <p className="text-xs text-red-500 mt-2 text-center">Upload failed. Please try again.</p>}
                                    <div className="flex gap-3 mt-5">
                                        <button onClick={() => setShowAddContextModal(false)} className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm">Cancel</button>
                                        <button
                                            disabled={!addContextFile || addContextStatus === 'uploading'}
                                            onClick={async () => {
                                                if (!addContextFile || !agentId) return;
                                                setAddContextStatus('uploading');
                                                try {
                                                    await addContext(agentId, addContextFile);
                                                    setAddContextStatus('done');
                                                } catch { setAddContextStatus('error'); }
                                            }}
                                            className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors text-sm flex items-center justify-center gap-2"
                                        >
                                            {addContextStatus === 'uploading' ? <><Loader2 className="h-4 w-4 animate-spin" />Uploading...</> : 'Upload'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Embed Modal ──────────────────────────────────────────── */}
            <AnimatePresence>
                {showEmbedModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowEmbedModal(false)}
                        />

                        {/* Modal */}
                        <motion.div
                            className="relative w-full max-w-3xl max-h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200/50 dark:border-gray-800/50">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Add Agent to Your Website
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Embed {agentName || 'this agent'} as a chat widget on your website
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowEmbedModal(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Framework Selector Tabs */}
                            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-800/50">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Select your framework:
                                </label>
                                <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl">
                                    {[
                                        { id: 'react' as const, name: 'React', icon: '\u269B\uFE0F' },
                                        { id: 'nextjs' as const, name: 'Next.js', icon: '\u25B2' },
                                        { id: 'html' as const, name: 'HTML/JS', icon: '\uD83C\uDF10' },
                                    ].map((fw) => (
                                        <button
                                            key={fw.id}
                                            onClick={() => setSelectedFramework(fw.id)}
                                            className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                                                selectedFramework === fw.id
                                                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                            }`}
                                        >
                                            <span>{fw.icon}</span>
                                            <span>{fw.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Code Block */}
                            <div className="px-6 py-4 max-h-[400px] overflow-y-auto">
                                <div className="relative group">
                                    <div className="absolute top-3 right-3 z-10">
                                        <button
                                            onClick={() => handleCopyCode(getEmbedCode())}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                                copiedCode
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-gray-700/80 hover:bg-gray-600 text-gray-300 opacity-0 group-hover:opacity-100'
                                            }`}
                                        >
                                            {copiedCode ? (
                                                <>
                                                    <Check className="w-3.5 h-3.5" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3.5 h-3.5" />
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <pre className="bg-gray-950 text-gray-200 p-5 rounded-xl overflow-x-auto text-[13px] font-mono leading-relaxed selection:bg-indigo-500/30">
                                        <code>{getEmbedCode()}</code>
                                    </pre>
                                </div>
                            </div>

                            {/* Footer Instructions */}
                            <div className="px-6 py-4 bg-indigo-50/50 dark:bg-indigo-950/20 border-t border-gray-200/50 dark:border-gray-800/50">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pt-1">
                                        {selectedFramework === 'html' ? (
                                            <p>Paste this code just before the closing <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs font-mono">&lt;/body&gt;</code> tag in your HTML file.</p>
                                        ) : (
                                            <p>Create a new component file and import it in your main layout or page. The widget will appear in the bottom-right corner of your website.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Messages Container ───────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto bg-transparent px-4 py-6 space-y-5">
                {/* Loading History */}
                {loading && messages.length === 0 && (
                    <div className="flex flex-col justify-center items-center h-full gap-4">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                            <div className="w-10 h-10 border-[3px] border-transparent border-t-indigo-500 border-r-violet-500 rounded-full"></div>
                        </motion.div>
                        <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">Loading messages...</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <motion.div
                        className="flex justify-center items-center p-4"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="flex items-center gap-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 backdrop-blur-sm px-5 py-3.5 rounded-xl border border-red-200/60 dark:border-red-800/40">
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            <span className="font-medium text-sm">{error}</span>
                        </div>
                    </motion.div>
                )}

                {/* Messages */}
                <AnimatePresence mode="popLayout">
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            initial={{ opacity: 0, y: 12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className={`flex gap-3 max-w-[80%] md:max-w-[70%] ${
                                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                            }`}>
                                {/* Avatar */}
                                <motion.div
                                    className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg ${
                                        message.role === 'user'
                                            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-500/25'
                                            : 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-indigo-500/25'
                                    }`}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    {message.role === 'user' ? (
                                        <User className="h-4 w-4" />
                                    ) : (
                                        <Bot className="h-4 w-4" />
                                    )}
                                </motion.div>

                                {/* Message Bubble */}
                                <div className="min-w-0">
                                    <motion.div
                                        className={`px-4 py-3 backdrop-blur-sm ${
                                            message.role === 'user'
                                                ? 'bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 text-white rounded-2xl rounded-tr-sm shadow-lg shadow-indigo-500/20'
                                                : 'bg-white/80 dark:bg-white/[0.06] text-gray-900 dark:text-gray-100 rounded-2xl rounded-tl-sm shadow-lg shadow-black/[0.03] dark:shadow-black/10 border border-gray-200/60 dark:border-white/[0.08]'
                                        }`}
                                        whileHover={{ scale: 1.005 }}
                                        transition={{ type: 'spring', stiffness: 400 }}
                                    >
                                        {message.role === 'assistant' ? (
                                            <div className="prose prose-sm dark:prose-invert max-w-none break-words
                                                prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                                                prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
                                                prose-p:leading-relaxed prose-p:my-1.5
                                                prose-strong:font-semibold prose-strong:text-gray-900 dark:prose-strong:text-white
                                                prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5
                                                prose-code:bg-indigo-50 dark:prose-code:bg-indigo-950/40 prose-code:text-indigo-700 dark:prose-code:text-indigo-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[13px] prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                                                prose-pre:bg-gray-950 dark:prose-pre:bg-black/40 prose-pre:rounded-xl prose-pre:p-4 prose-pre:border prose-pre:border-gray-200/20 dark:prose-pre:border-white/[0.06]
                                                prose-blockquote:border-l-4 prose-blockquote:border-indigo-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
                                                prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:underline prose-a:decoration-indigo-300 dark:prose-a:decoration-indigo-700 prose-a:underline-offset-2
                                                prose-hr:border-gray-200 dark:prose-hr:border-gray-700">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {message.content}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
                                        )}

                                        {/* Metadata badges for assistant messages */}
                                        {message.role === 'assistant' && message.metadata && (
                                            <div className="mt-3 pt-3 border-t border-gray-200/40 dark:border-white/[0.06] text-xs flex items-center gap-2 flex-wrap">
                                                {message.metadata.chunksRetrieved !== undefined && (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-100/80 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full font-medium">
                                                        <Sparkles className="h-3 w-3" />
                                                        {message.metadata.chunksRetrieved} sources
                                                    </span>
                                                )}
                                                {message.metadata.processingTimeMs !== undefined && (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full font-medium">
                                                        <Loader2 className="h-3 w-3" />
                                                        {(message.metadata.processingTimeMs / 1000).toFixed(1)}s
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Timestamp */}
                                    <p className={`text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 px-1 font-medium ${
                                        message.role === 'user' ? 'text-right' : 'text-left'
                                    }`}>
                                        {formatMessageTime(message.created_at)}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                {sending && (
                    <motion.div
                        className="flex justify-start"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex gap-3 max-w-[80%] md:max-w-[70%]">
                            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                                <Bot className="h-4 w-4" />
                            </div>
                            <div className="px-5 py-4 rounded-2xl rounded-tl-sm bg-white/80 dark:bg-white/[0.06] backdrop-blur-sm shadow-lg shadow-black/[0.03] dark:shadow-black/10 border border-gray-200/60 dark:border-white/[0.08]">
                                <div className="flex gap-1.5 items-center h-4">
                                    <motion.div
                                        className="w-2 h-2 bg-indigo-500 rounded-full"
                                        animate={{ y: [0, -6, 0] }}
                                        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
                                    />
                                    <motion.div
                                        className="w-2 h-2 bg-violet-500 rounded-full"
                                        animate={{ y: [0, -6, 0] }}
                                        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                                    />
                                    <motion.div
                                        className="w-2 h-2 bg-pink-500 rounded-full"
                                        animate={{ y: [0, -6, 0] }}
                                        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* ── Input Area ───────────────────────────────────────────── */}
            <div className="bg-white/70 dark:bg-gray-950/70 backdrop-blur-2xl border-t border-gray-200/40 dark:border-white/[0.06] px-4 py-4">
                <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
                    <textarea
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={agentId ? 'Type a message...' : 'Select an agent to start chatting'}
                        rows={1}
                        className="flex-1 resize-none px-5 py-3.5 bg-gray-100/80 dark:bg-white/[0.05] backdrop-blur-sm border border-gray-200/50 dark:border-white/[0.08] rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 dark:focus:ring-indigo-400/30 dark:focus:border-indigo-400/30 max-h-32 transition-all text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        disabled={sending || !agentId}
                    />
                    <motion.button
                        type="submit"
                        disabled={!inputMessage.trim() || sending || !agentId}
                        whileHover={{ scale: sending || !inputMessage.trim() ? 1 : 1.05 }}
                        whileTap={{ scale: sending || !inputMessage.trim() ? 1 : 0.95 }}
                        className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-700 dark:disabled:to-gray-600 text-white rounded-2xl flex items-center justify-center transition-all disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 disabled:shadow-none"
                    >
                        {sending ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                                <Loader2 className="h-5 w-5" />
                            </motion.div>
                        ) : (
                            <Send className="h-5 w-5" />
                        )}
                    </motion.button>
                </form>
            </div>
        </div>
    );
}
