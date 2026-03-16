'use client';

import { useState } from 'react';
import { X, Globe, FileText, Upload, Link as LinkIcon, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useAgents } from '@/hooks/useAgents';

interface AddAgentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export interface AgentFormData {
    type: 'website' | 'document';
    name: string;
    description: string;
    url?: string;
    file?: File;
}

type TabType = 'website' | 'document';

const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants: Variants = {
    hidden: { scale: 0.92, opacity: 0, y: 24 },
    visible: {
        scale: 1,
        opacity: 1,
        y: 0,
        transition: { type: 'spring', damping: 28, stiffness: 340, mass: 0.8 },
    },
    exit: {
        scale: 0.92,
        opacity: 0,
        y: 24,
        transition: { duration: 0.2, ease: 'easeIn' },
    },
};

const tabContentVariants: Variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 28 : -28,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] as const },
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 28 : -28,
        opacity: 0,
        transition: { duration: 0.18, ease: 'easeIn' },
    }),
};

const inputClasses =
    'w-full px-4 py-3 border border-gray-200/60 dark:border-white/[0.08] rounded-xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-500/40 dark:focus:ring-indigo-400/30 focus:border-indigo-400 dark:focus:border-indigo-500/60 hover:border-gray-300 dark:hover:border-white/[0.12]';

const textareaClasses =
    'w-full px-4 py-3 border border-gray-200/60 dark:border-white/[0.08] rounded-xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-500/40 dark:focus:ring-indigo-400/30 focus:border-indigo-400 dark:focus:border-indigo-500/60 hover:border-gray-300 dark:hover:border-white/[0.12]';

export default function AddAgentModal({ isOpen, onClose, onSuccess }: AddAgentModalProps) {
    const { uploadDocument, scrapeWebsite, loading, error } = useAgents();
    const [activeTab, setActiveTab] = useState<TabType>('website');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        url: '',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [tabDirection, setTabDirection] = useState(0);

    const handleTabChange = (tab: TabType) => {
        setTabDirection(tab === 'website' ? -1 : 1);
        setActiveTab(tab);
        setFormData({
            name: '',
            description: '',
            url: '',
        });
        setSelectedFile(null);
        setUploadStatus('idle');
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            // Auto-populate name if empty
            if (!formData.name) {
                const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
                setFormData(prev => ({ ...prev, name: nameWithoutExt }));
            }
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file && isValidFileType(file)) {
            setSelectedFile(file);
            if (!formData.name) {
                const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
                setFormData(prev => ({ ...prev, name: nameWithoutExt }));
            }
        }
    };

    const isValidFileType = (file: File) => {
        const validTypes = ['.pdf', '.txt', '.docx'];
        return validTypes.some(type => file.name.toLowerCase().endsWith(type));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid()) return;

        try {
            setUploadStatus('uploading');

            if (activeTab === 'document' && selectedFile) {
                // Upload document
                await uploadDocument({
                    file: selectedFile,
                    name: formData.name,
                    description: formData.description,
                });
            } else if (activeTab === 'website' && formData.url) {
                // Scrape website
                await scrapeWebsite(formData.url, formData.name, formData.description);
            }

            setUploadStatus('success');

            // Show success message briefly then close
            setTimeout(() => {
                onSuccess?.();
                onClose();
                // Reset form
                setFormData({ name: '', description: '', url: '' });
                setSelectedFile(null);
                setUploadStatus('idle');
            }, 1500);

        } catch (err) {
            console.error('Error creating agent:', err);
            setUploadStatus('error');
        }
    };

    const isFormValid = () => {
        if (!formData.name.trim()) return false;
        if (activeTab === 'website') {
            return formData.url && formData.url.trim().length > 0;
        } else {
            return selectedFile !== null;
        }
    };

    const tabs: { key: TabType; label: string; icon: typeof Globe }[] = [
        { key: 'website', label: 'Website URL', icon: Globe },
        { key: 'document', label: 'Upload Document', icon: FileText },
    ];

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.25 }}
                        onClick={onClose}
                    />

                    {/* Centered wrapper */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            className="pointer-events-auto w-full max-w-2xl max-h-[90vh] bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.25)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.55)] border border-gray-200/40 dark:border-white/[0.06] overflow-hidden flex flex-col ring-1 ring-black/[0.03] dark:ring-white/[0.04]"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* ── Header ── */}
                            <div className="flex items-center justify-between px-7 pt-7 pb-5">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 dark:shadow-indigo-500/20">
                                            <Sparkles className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 opacity-20 blur-md -z-10" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
                                            Add New Agent
                                        </h2>
                                        <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                                            Create a knowledge base from a website or document
                                        </p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                    onClick={onClose}
                                    className="p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-white/[0.06] transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </div>

                            {/* ── Tabs ── */}
                            <div className="flex px-7 gap-1 relative">
                                {tabs.map((tab) => {
                                    const isActive = activeTab === tab.key;
                                    const Icon = tab.icon;
                                    return (
                                        <motion.button
                                            key={tab.key}
                                            whileHover={{ scale: 1.015 }}
                                            whileTap={{ scale: 0.985 }}
                                            onClick={() => handleTabChange(tab.key)}
                                            className={`relative flex-1 flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-t-xl text-sm font-semibold transition-colors duration-200 ${isActive
                                                    ? 'text-indigo-600 dark:text-indigo-400'
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                                }`}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeTabBg"
                                                    className="absolute inset-0 rounded-t-xl bg-indigo-50/60 dark:bg-indigo-500/[0.08]"
                                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                                />
                                            )}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeTabBorder"
                                                    className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500"
                                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                                />
                                            )}
                                            <Icon className="w-[18px] h-[18px] relative z-10" />
                                            <span className="relative z-10">{tab.label}</span>
                                        </motion.button>
                                    );
                                })}
                                {/* Separator line */}
                                <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200/60 dark:bg-white/[0.06]" />
                            </div>

                            {/* ── Form Content ── */}
                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                                <AnimatePresence mode="wait" custom={tabDirection}>
                                    {activeTab === 'website' && (
                                        <motion.div
                                            key="website"
                                            custom={tabDirection}
                                            variants={tabContentVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            className="p-7 space-y-5"
                                        >
                                            {/* URL input */}
                                            <div>
                                                <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5">
                                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-sm">
                                                        <LinkIcon className="w-3 h-3 text-white" />
                                                    </span>
                                                    Website URL
                                                </label>
                                                <input
                                                    type="url"
                                                    value={formData.url || ''}
                                                    onChange={(e) => handleInputChange('url', e.target.value)}
                                                    placeholder="https://example.com"
                                                    className={inputClasses}
                                                />
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 ml-0.5 leading-relaxed">
                                                    Enter the URL of the website you want to scrape and create a knowledge base from
                                                </p>
                                            </div>

                                            {/* Agent Name */}
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5 block">
                                                    Agent Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    placeholder="My Company Website"
                                                    className={inputClasses}
                                                />
                                            </div>

                                            {/* Description */}
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5 block">
                                                    Description
                                                    <span className="ml-1.5 text-xs font-normal text-gray-400 dark:text-gray-500">Optional</span>
                                                </label>
                                                <textarea
                                                    value={formData.description}
                                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                                    placeholder="A brief description of what this agent knows about..."
                                                    rows={3}
                                                    className={textareaClasses}
                                                />
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'document' && (
                                        <motion.div
                                            key="document"
                                            custom={tabDirection}
                                            variants={tabContentVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            className="p-7 space-y-5"
                                        >
                                            {/* Drag & Drop zone */}
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5 block">
                                                    Upload Document
                                                </label>
                                                <motion.div
                                                    onDragEnter={handleDrag}
                                                    onDragLeave={handleDrag}
                                                    onDragOver={handleDrag}
                                                    onDrop={handleDrop}
                                                    animate={dragActive ? { scale: 1.02 } : { scale: 1 }}
                                                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors duration-200 ${dragActive
                                                            ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/[0.08]'
                                                            : 'border-gray-200/80 dark:border-white/[0.08] hover:border-gray-300 dark:hover:border-white/[0.14] bg-gray-50/40 dark:bg-white/[0.02]'
                                                        }`}
                                                >
                                                    <input
                                                        type="file"
                                                        id="file-upload"
                                                        accept=".pdf,.txt,.docx"
                                                        onChange={handleFileChange}
                                                        className="hidden"
                                                    />

                                                    <AnimatePresence mode="wait">
                                                        {selectedFile ? (
                                                            <motion.div
                                                                key="selected"
                                                                className="space-y-3"
                                                                initial={{ scale: 0.9, opacity: 0 }}
                                                                animate={{ scale: 1, opacity: 1 }}
                                                                exit={{ scale: 0.9, opacity: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                <div className="flex items-center justify-center">
                                                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-500/20">
                                                                        <CheckCircle2 className="w-7 h-7 text-white" />
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                        {selectedFile.name}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                                        {(selectedFile.size / 1024).toFixed(2)} KB
                                                                    </p>
                                                                </div>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    type="button"
                                                                    onClick={() => setSelectedFile(null)}
                                                                    className="text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-medium hover:underline underline-offset-2 transition-colors"
                                                                >
                                                                    Remove file
                                                                </motion.button>
                                                            </motion.div>
                                                        ) : (
                                                            <motion.div
                                                                key="empty"
                                                                className="space-y-3"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                <div className="flex items-center justify-center">
                                                                    <motion.div
                                                                        animate={dragActive ? { y: -4 } : { y: 0 }}
                                                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                                                        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/20"
                                                                    >
                                                                        <Upload className="w-7 h-7 text-white" />
                                                                    </motion.div>
                                                                </div>
                                                                <div>
                                                                    <label
                                                                        htmlFor="file-upload"
                                                                        className="cursor-pointer text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
                                                                    >
                                                                        Click to upload
                                                                    </label>
                                                                    <span className="text-gray-500 dark:text-gray-400"> or drag and drop</span>
                                                                </div>
                                                                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                                                                    PDF, TXT, or DOCX (max 10MB)
                                                                </p>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            </div>

                                            {/* Agent Name */}
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5 block">
                                                    Agent Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    placeholder="Product Documentation"
                                                    className={inputClasses}
                                                />
                                            </div>

                                            {/* Description */}
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5 block">
                                                    Description
                                                    <span className="ml-1.5 text-xs font-normal text-gray-400 dark:text-gray-500">Optional</span>
                                                </label>
                                                <textarea
                                                    value={formData.description}
                                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                                    placeholder="A brief description of what this agent knows about..."
                                                    rows={3}
                                                    className={textareaClasses}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>

                            {/* ── Footer ── */}
                            <div className="flex flex-col gap-3 px-7 py-5 border-t border-gray-200/50 dark:border-white/[0.06] bg-gray-50/60 dark:bg-white/[0.02] flex-shrink-0">
                                {/* Status Messages */}
                                <AnimatePresence>
                                    {uploadStatus === 'success' && (
                                        <motion.div
                                            className="flex items-center gap-2.5 px-4 py-3 bg-emerald-50/80 dark:bg-emerald-500/[0.1] text-emerald-700 dark:text-emerald-300 rounded-xl border border-emerald-200/60 dark:border-emerald-500/20"
                                            initial={{ opacity: 0, y: -8, height: 0 }}
                                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                                            exit={{ opacity: 0, y: -8, height: 0 }}
                                            transition={{ duration: 0.25 }}
                                        >
                                            <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0" />
                                            <span className="text-sm font-medium">Agent created successfully! Processing in background...</span>
                                        </motion.div>
                                    )}

                                    {uploadStatus === 'error' && error && (
                                        <motion.div
                                            className="flex items-center gap-2.5 px-4 py-3 bg-red-50/80 dark:bg-red-500/[0.1] text-red-700 dark:text-red-300 rounded-xl border border-red-200/60 dark:border-red-500/20"
                                            initial={{ opacity: 0, y: -8, height: 0 }}
                                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                                            exit={{ opacity: 0, y: -8, height: 0 }}
                                            transition={{ duration: 0.25 }}
                                        >
                                            <X className="w-4.5 h-4.5 flex-shrink-0" />
                                            <span className="text-sm font-medium">{error}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex items-center justify-between gap-4">
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium leading-relaxed">
                                        {activeTab === 'website'
                                            ? "We'll crawl and index the website content"
                                            : "We'll extract and process the document content"}
                                    </p>

                                    <div className="flex items-center gap-2.5 flex-shrink-0">
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.96 }}
                                            onClick={onClose}
                                            disabled={uploadStatus === 'uploading'}
                                            className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-white/[0.06] rounded-xl transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            Cancel
                                        </motion.button>

                                        <motion.button
                                            type="submit"
                                            whileHover={{ scale: isFormValid() && uploadStatus !== 'uploading' ? 1.04 : 1 }}
                                            whileTap={{ scale: isFormValid() && uploadStatus !== 'uploading' ? 0.96 : 1 }}
                                            onClick={handleSubmit}
                                            disabled={!isFormValid() || uploadStatus === 'uploading'}
                                            className={`relative flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 overflow-hidden ${isFormValid() && uploadStatus !== 'uploading'
                                                    ? 'text-white bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 shadow-lg shadow-indigo-500/25 dark:shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30'
                                                    : 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/[0.06] cursor-not-allowed'
                                                }`}
                                        >
                                            {uploadStatus === 'uploading' && (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                >
                                                    <Loader2 className="w-4 h-4" />
                                                </motion.div>
                                            )}
                                            {uploadStatus === 'uploading' ? 'Creating...' : 'Create Agent'}
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
