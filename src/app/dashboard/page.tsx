"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AgentSidebar from "@/components/dashboard/AgentSidebar";
import ChatPanel from "@/components/dashboard/ChatPanel";
import { useAgents, Agent } from "@/hooks/useAgents";
import AddAgentModal from "@/components/dashboard/AddAgentModal";

export default function DashboardPage() {
    const { user, isLoaded } = useUser();
    const { fetchAgents, deleteAgent } = useAgents();
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isAddAgentModalOpen, setIsAddAgentModalOpen] = useState(false);
    const [creationBanner, setCreationBanner] = useState(false);
    const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);
    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const stopPolling = useCallback(() => {
        if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
    }, []);

    const startPolling = useCallback(() => {
        stopPolling();
        let attempts = 0;
        pollingRef.current = setInterval(async () => {
            attempts++;
            try {
                const fetched = await fetchAgents();
                setAgents(fetched);
                setSidebarRefreshKey(k => k + 1);
                if (attempts >= 12) stopPolling();
            } catch { /* ignore */ }
        }, 5000);
    }, [fetchAgents, stopPolling]);

    useEffect(() => () => stopPolling(), [stopPolling]);

    // Load agents on mount
    useEffect(() => {
        loadAgents();
    }, []);

    // Update selected agent when selectedAgentId changes
    useEffect(() => {
        if (selectedAgentId && agents.length > 0) {
            const agent = agents.find(a => a.id === selectedAgentId);
            setSelectedAgent(agent || null);
        } else {
            setSelectedAgent(null);
        }
    }, [selectedAgentId, agents]);

    const loadAgents = async () => {
        try {
            const fetchedAgents = await fetchAgents();
            setAgents(fetchedAgents);
        } catch (error) {
            console.error('Failed to load agents:', error);
        }
    };

    const handleSelectAgent = (agentId: string) => {
        setSelectedAgentId(agentId);
        setIsMobileSidebarOpen(false); // Close mobile sidebar when agent is selected
    };

    const handleAddAgent = () => {
        setIsAddAgentModalOpen(true);
    };

    const handleModalSuccess = () => {
        loadAgents();
        setCreationBanner(true);
        startPolling();
        setSidebarRefreshKey(k => k + 1);
        setTimeout(() => setCreationBanner(false), 8000);
    };

    const handleDeleteAgent = async (agentId: string) => {
        try {
            await deleteAgent(agentId);
            // Remove from local state
            setAgents(prev => prev.filter(a => a.id !== agentId));
            setSidebarRefreshKey(k => k + 1);
            // Deselect if this was the selected agent
            if (selectedAgentId === agentId) {
                setSelectedAgentId(null);
                setSelectedAgent(null);
            }
        } catch (error) {
            console.error('Failed to delete agent:', error);
            throw error;
        }
    };

    if (!isLoaded) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-50/30 dark:from-gray-950 dark:via-indigo-950/20 dark:to-violet-950/10 relative overflow-hidden">
                {/* Aurora background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-transparent rounded-full blur-[100px]"
                        animate={{
                            x: [0, 80, -40, 0],
                            y: [0, -60, 30, 0],
                            scale: [1, 1.15, 0.95, 1],
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-violet-500/12 via-indigo-400/8 to-transparent rounded-full blur-[100px]"
                        animate={{
                            x: [0, -60, 40, 0],
                            y: [0, 40, -30, 0],
                            scale: [1, 1.1, 0.9, 1],
                        }}
                        transition={{
                            duration: 22,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-amber-400/8 via-orange-300/5 to-transparent rounded-full blur-[80px]"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                            duration: 14,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>
                <motion.div
                    className="text-center relative z-10"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="w-16 h-16 mx-auto mb-6 relative">
                        <motion.div
                            className="absolute inset-0 rounded-full border-[3px] border-indigo-500/20 dark:border-indigo-400/20"
                            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                        />
                        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-indigo-500 border-r-violet-500 animate-spin" />
                        <div className="absolute inset-2 rounded-full border-[2px] border-transparent border-b-amber-400/60 border-l-amber-400/60 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium tracking-wide uppercase">Loading your workspace</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-screen flex overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20 dark:from-gray-950 dark:via-indigo-950/15 dark:to-violet-950/10 relative">
            {/* Animated aurora background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/[0.07] via-violet-500/[0.05] to-transparent rounded-full blur-[100px]"
                    animate={{
                        x: [0, 120, 40, 0],
                        y: [0, 60, -20, 0],
                        scale: [1, 1.2, 0.95, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-gradient-to-tl from-violet-500/[0.06] via-indigo-400/[0.04] to-transparent rounded-full blur-[100px]"
                    animate={{
                        x: [0, -80, -20, 0],
                        y: [0, -60, 20, 0],
                        scale: [1, 1.15, 0.9, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/3 w-[350px] h-[350px] bg-gradient-to-r from-amber-400/[0.04] via-orange-300/[0.03] to-transparent rounded-full blur-[80px]"
                    animate={{
                        x: [0, 60, -40, 0],
                        y: [0, -40, 30, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/70 dark:bg-gray-950/70 backdrop-blur-2xl border-b border-indigo-100/50 dark:border-indigo-900/30 px-4 py-3 flex items-center gap-3 z-30">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                    className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition-all duration-200"
                >
                    {isMobileSidebarOpen ? (
                        <X className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    ) : (
                        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    )}
                </motion.button>
                {selectedAgentId && selectedAgent && (
                    <motion.div
                        className="flex items-center gap-2.5"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-500/25 ring-2 ring-white/50 dark:ring-gray-900/50">
                            {selectedAgent.logo_url ? (
                                <img src={selectedAgent.logo_url} alt={selectedAgent.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                selectedAgent.name.substring(0, 2).toUpperCase()
                            )}
                        </div>
                        <span className="font-semibold text-sm bg-gradient-to-r from-indigo-700 to-violet-700 dark:from-indigo-300 dark:to-violet-300 bg-clip-text text-transparent">
                            {selectedAgent.name}
                        </span>
                    </motion.div>
                )}
            </div>

            {/* Left Sidebar - Agent List */}
            <aside
                className={`
                    fixed lg:relative inset-y-0 left-0 z-20
                    w-full lg:w-[30%] lg:min-w-[280px] lg:max-w-[360px]
                    bg-white/60 dark:bg-gray-950/60 backdrop-blur-2xl
                    border-r border-indigo-100/40 dark:border-indigo-900/20
                    shadow-xl shadow-indigo-500/[0.03] dark:shadow-indigo-500/[0.02]
                    transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                    ${isMobileSidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                    }
                    lg:block
                    mt-[52px] lg:mt-0
                `}
            >
                <AgentSidebar
                    selectedAgentId={selectedAgentId}
                    onSelectAgent={handleSelectAgent}
                    onAddAgent={handleAddAgent}
                    isMobileOpen={isMobileSidebarOpen}
                    onCloseMobile={() => setIsMobileSidebarOpen(false)}
                    refreshKey={sidebarRefreshKey}
                />
            </aside>

            {/* Mobile Overlay */}
            {isMobileSidebarOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-10 lg:hidden mt-[52px]"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {/* Creation Banner */}
            <AnimatePresence>
                {creationBanner && (
                    <motion.div
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 bg-emerald-600 text-white rounded-2xl shadow-xl text-sm font-semibold"
                        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
                        transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                    >
                        <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" /></span>
                        Your agent is being created — it will appear in the sidebar within 1 minute.
                        <button onClick={() => setCreationBanner(false)} className="ml-1 opacity-70 hover:opacity-100 transition-opacity"><X className="w-4 h-4" /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Right Panel - Chat Interface */}
            <main className="flex-1 flex flex-col bg-transparent pt-[52px] lg:pt-0 relative z-0 min-w-0">
                <ChatPanel
                    agentId={selectedAgentId}
                    agentName={selectedAgent?.name}
                    agentType={selectedAgent?.type}
                    onDeleteAgent={selectedAgentId ? () => handleDeleteAgent(selectedAgentId) : undefined}
                />
            </main>

            {/* Add Agent Modal - Rendered at root level */}
            <AddAgentModal
                isOpen={isAddAgentModalOpen}
                onClose={() => setIsAddAgentModalOpen(false)}
                onSuccess={handleModalSuccess}
            />
        </div>
    );
}
