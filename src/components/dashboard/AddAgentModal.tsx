'use client';

import { useState } from 'react';
import { X, Globe, FileText, Upload, Link as LinkIcon, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

export default function AddAgentModal({ isOpen, onClose, onSuccess }: AddAgentModalProps) {
    const { uploadDocument, scrapeWebsite, loading, error } = useAgents();
    const [activeTab, setActiveTab] = useState<TabType>('document');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        url: '',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

    const handleTabChange = (tab: TabType) => {
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

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    
                    {/* Centered Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            className="w-full max-w-2xl max-h-[90vh] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden flex flex-col"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200/70 dark:border-white/10 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center shadow-sm">
                                    <Sparkles className="h-5 w-5 text-white dark:text-gray-900" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        Add New Agent
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                        Create a knowledge base from a website or document
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </motion.button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-200/70 dark:border-white/10 flex-shrink-0">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleTabChange('website')}
                                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all ${activeTab === 'website'
                                        ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white bg-gray-100/70 dark:bg-white/10'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50/70 dark:hover:bg-white/10'
                                    }`}
                            >
                                <Globe className="w-5 h-5" />
                                <span>Website URL</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleTabChange('document')}
                                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all ${activeTab === 'document'
                                        ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white bg-gray-100/70 dark:bg-white/10'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50/70 dark:hover:bg-white/10'
                                    }`}
                            >
                                <FileText className="w-5 h-5" />
                                <span>Upload Document</span>
                            </motion.button>
                        </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Website Tab */}
                    {activeTab === 'website' && (
                        <motion.div 
                            className="space-y-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    <div className="w-6 h-6 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center shadow-sm">
                                        <LinkIcon className="w-3.5 h-3.5 text-white dark:text-gray-900" />
                                    </div>
                                    Website URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.url || ''}
                                    onChange={(e) => handleInputChange('url', e.target.value)}
                                    placeholder="https://example.com"
                                    className="w-full px-4 py-3 border border-gray-300/60 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:border-transparent bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-1">
                                    Enter the URL of the website you want to scrape and create a knowledge base from
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                                    Agent Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="My Company Website"
                                    className="w-full px-4 py-3 border border-gray-300/60 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:border-transparent bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="A brief description of what this agent knows about..."
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300/60 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:border-transparent bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none transition-all"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Document Tab */}
                    {activeTab === 'document' && (
                        <motion.div 
                            className="space-y-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div>
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                                    Upload Document
                                </label>
                                <motion.div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    whileHover={{ scale: dragActive ? 1 : 1.01 }}
                                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all backdrop-blur-sm ${dragActive
                                            ? 'border-gray-900 dark:border-white bg-gray-100/70 dark:bg-white/10 scale-105'
                                            : 'border-gray-300/60 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20 bg-white/40 dark:bg-gray-900/40'
                                        }`}
                                >
                                    <input
                                        type="file"
                                        id="file-upload"
                                        accept=".pdf,.txt,.docx"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />

                                    {selectedFile ? (
                                        <motion.div 
                                            className="space-y-3"
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                        >
                                            <div className="flex items-center justify-center">
                                                <div className="w-16 h-16 rounded-2xl bg-gray-900 dark:bg-white flex items-center justify-center shadow-sm">
                                                    <CheckCircle2 className="w-8 h-8 text-white dark:text-gray-900" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {selectedFile.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                                </p>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                type="button"
                                                onClick={() => setSelectedFile(null)}
                                                className="text-sm text-red-600 dark:text-red-400 hover:underline font-medium"
                                            >
                                                Remove file
                                            </motion.button>
                                        </motion.div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-center">
                                                <div className="w-16 h-16 rounded-2xl bg-gray-900 dark:bg-white flex items-center justify-center shadow-sm">
                                                    <Upload className="w-8 h-8 text-white dark:text-gray-900" />
                                                </div>
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="file-upload"
                                                    className="cursor-pointer text-gray-900 dark:text-white hover:opacity-70 font-semibold"
                                                >
                                                    Click to upload
                                                </label>
                                                <span className="text-gray-600 dark:text-gray-400"> or drag and drop</span>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                PDF, TXT, or DOCX (max 10MB)
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                                    Agent Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Product Documentation"
                                    className="w-full px-4 py-3 border border-gray-300/60 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:border-transparent bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="A brief description of what this agent knows about..."
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300/60 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 focus:border-transparent bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none transition-all"
                                />
                            </div>
                        </motion.div>
                    )}
                </form>

                {/* Footer */}
                <div className="flex flex-col gap-3 p-6 border-t border-gray-200/70 dark:border-white/10 bg-gray-50/70 dark:bg-white/5 flex-shrink-0">
                    {/* Status Messages */}
                    {uploadStatus === 'success' && (
                        <motion.div 
                            className="flex items-center gap-2 px-4 py-3 bg-green-100/80 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-xl backdrop-blur-sm border border-green-200/50 dark:border-green-800/50"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="text-sm font-medium">Agent created successfully! Processing in background...</span>
                        </motion.div>
                    )}

                    {uploadStatus === 'error' && error && (
                        <motion.div 
                            className="flex items-center gap-2 px-4 py-3 bg-red-100/80 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-xl backdrop-blur-sm border border-red-200/50 dark:border-red-800/50"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <X className="w-5 h-5" />
                            <span className="text-sm font-medium">{error}</span>
                        </motion.div>
                    )}

                    <div className="flex items-center justify-between gap-3">
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {activeTab === 'website'
                                ? '🌐 We\'ll crawl and index the website content'
                                : '📄 We\'ll extract and process the document content'}
                        </div>
                        <div className="flex gap-3">
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                disabled={uploadStatus === 'uploading'}
                                className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                type="submit"
                                whileHover={{ scale: isFormValid() && uploadStatus !== 'uploading' ? 1.05 : 1 }}
                                whileTap={{ scale: isFormValid() && uploadStatus !== 'uploading' ? 0.95 : 1 }}
                                onClick={handleSubmit}
                                disabled={!isFormValid() || uploadStatus === 'uploading'}
                                className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all shadow-sm ${isFormValid() && uploadStatus !== 'uploading'
                                        ? 'bg-gray-900 hover:bg-black'
                                        : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-50 shadow-none'
                                    }`}
                            >
                                {uploadStatus === 'uploading' && (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
