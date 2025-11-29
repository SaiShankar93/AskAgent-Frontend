"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
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
        loadAgents(); // Refresh agents list
    };

    const handleDeleteAgent = async (agentId: string) => {
        try {
            await deleteAgent(agentId);
            // Remove from local state
            setAgents(prev => prev.filter(a => a.id !== agentId));
            // Deselect if this was the selected agent
            if (selectedAgentId === agentId) {
                setSelectedAgentId(null);
                setSelectedAgent(null);
            }
        } catch (error) {
            console.error('Failed to delete agent:', error);
            throw error; // Re-throw so the modal can handle it
        }
    };

    if (!isLoaded) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
                {/* Animated background blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
                        animate={{
                            x: [0, 100, 0],
                            y: [0, 50, 0],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
                        animate={{
                            x: [0, -100, 0],
                            y: [0, -50, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>
                <motion.div
                    className="text-center relative z-10"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-16 h-16 mx-auto mb-6 relative">
                        <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Loading your agents...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-screen flex overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative">
            {/* Animated background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
                    animate={{
                        x: [0, -100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 px-4 py-3 flex items-center gap-3 z-10">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                    <Menu className="h-5 w-5" />
                </motion.button>
                {selectedAgentId && selectedAgent && (
                    <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold shadow-lg shadow-blue-500/30">
                            {selectedAgent.logo_url ? (
                                <img src={selectedAgent.logo_url} alt={selectedAgent.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                selectedAgent.name.substring(0, 2).toUpperCase()
                            )}
                        </div>
                        <span className="font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">{selectedAgent.name}</span>
                    </motion.div>
                )}
            </div>

            {/* Left Sidebar - Agent List */}
            <aside
                className={`
            fixed lg:relative inset-y-0 left-0 z-20
            w-full lg:w-[30%] max-w-sm
            bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
            border-r border-gray-200/50 dark:border-gray-800/50
            transform transition-transform duration-300 ease-in-out
            ${isMobileSidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                    }
            lg:block
            mt-14 lg:mt-0
        `}
            >
                <AgentSidebar
                    selectedAgentId={selectedAgentId}
                    onSelectAgent={handleSelectAgent}
                    onAddAgent={handleAddAgent}
                    isMobileOpen={isMobileSidebarOpen}
                    onCloseMobile={() => setIsMobileSidebarOpen(false)}
                />
            </aside>

            {/* Mobile Overlay */}
            {isMobileSidebarOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 lg:hidden mt-14"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {/* Right Panel - Chat Interface */}
            <main className="flex-1 flex flex-col bg-transparent pt-14 lg:pt-0 relative z-0">
                <ChatPanel 
                    agentId={selectedAgentId} 
                    agentName={selectedAgent?.name}
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
