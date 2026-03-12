'use client';

import { Plus, Globe, FileText, X, Search, Loader2, Sparkles, Moon, Sun, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserButton } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { useAgents, Agent } from '@/hooks/useAgents';

interface AgentSidebarProps {
  selectedAgentId: string | null;
  onSelectAgent: (agentId: string) => void;
  onAddAgent: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  refreshKey?: number;
}

export default function AgentSidebar({
  selectedAgentId,
  onSelectAgent,
  onAddAgent,
  isMobileOpen,
  onCloseMobile,
  refreshKey = 0,
}: AgentSidebarProps) {
  const { fetchAgents, deleteAgent, loading } = useAgents();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [deletingAgentId, setDeletingAgentId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadAgents();
  }, [refreshKey]);

  const loadAgents = async () => {
    try {
      const fetchedAgents = await fetchAgents();
      setAgents(fetchedAgents);
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteAgent = async (agentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(agentId);
  };

  const confirmDelete = async (agentId: string) => {
    try {
      setDeletingAgentId(agentId);
      await deleteAgent(agentId);
      setAgents(prev => prev.filter(a => a.id !== agentId));
      if (selectedAgentId === agentId) {
        onSelectAgent('');
      }
    } catch (error) {
      console.error('Failed to delete agent:', error);
    } finally {
      setDeletingAgentId(null);
      setShowDeleteConfirm(null);
    }
  };

  const getAgentIcon = (type: 'website' | 'document') => {
    return type === 'website' ? Globe : FileText;
  };

  const getAgentInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="h-full flex flex-col bg-white/70 dark:bg-gray-950/80 backdrop-blur-xl">
      {/* ── Header ── */}
      <div className="px-5 pt-5 pb-4 border-b border-indigo-100/60 dark:border-white/[0.06]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Sparkles className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
              <div className="absolute -inset-1 bg-indigo-500/20 rounded-full blur-md -z-10" />
            </div>
            <h2 className="text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-700 via-violet-600 to-indigo-700 dark:from-indigo-300 dark:via-violet-300 dark:to-indigo-300 bg-clip-text text-transparent">
              My Agents
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-white/[0.06] transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-[18px] w-[18px] text-amber-400" />
              ) : (
                <Moon className="h-[18px] w-[18px] text-indigo-500" />
              )}
            </motion.button>

            {/* User avatar */}
            <div className="flex items-center px-0.5">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8 ring-2 ring-indigo-200/50 dark:ring-indigo-500/20 rounded-xl',
                  },
                }}
              />
            </div>

            {/* Add agent */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onAddAgent}
              className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25 dark:shadow-indigo-500/15 hover:shadow-indigo-500/40 transition-shadow"
              title="Add New Agent"
            >
              <Plus className="h-[18px] w-[18px]" />
            </motion.button>

            {/* Mobile close */}
            {isMobileOpen && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onCloseMobile}
                className="lg:hidden p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
              >
                <X className="h-[18px] w-[18px]" />
              </motion.button>
            )}
          </div>
        </div>

        {/* ── Search ── */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl
              bg-gray-50/80 dark:bg-white/[0.04]
              border border-gray-200/70 dark:border-white/[0.06]
              backdrop-blur-sm
              text-gray-900 dark:text-gray-100
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400/40
              dark:focus:ring-indigo-400/20 dark:focus:border-indigo-400/30
              transition-all duration-200"
          />
        </motion.div>
      </div>

      {/* ── Agent List ── */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
        {loading ? (
          /* Loading spinner */
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
            </motion.div>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              Loading agents...
            </span>
          </div>
        ) : filteredAgents.length === 0 ? (
          /* Empty state */
          <motion.div
            className="flex flex-col items-center justify-center h-72 px-6 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative mb-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-500/10 dark:to-violet-500/10 border border-indigo-200/50 dark:border-indigo-500/10 flex items-center justify-center">
                <Plus className="h-9 w-9 text-indigo-400 dark:text-indigo-500" />
              </div>
              <div className="absolute -inset-3 bg-gradient-to-br from-indigo-200/40 to-violet-200/40 dark:from-indigo-500/5 dark:to-violet-500/5 rounded-3xl blur-xl -z-10" />
            </div>
            <h3 className="text-base font-semibold mb-1.5 text-gray-800 dark:text-gray-200">
              {searchQuery ? 'No agents found' : 'No agents yet'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 max-w-[220px] leading-relaxed">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Create your first AI agent to get started'}
            </p>
            {!searchQuery && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onAddAgent}
                className="px-5 py-2.5 text-sm font-medium rounded-xl text-white
                  bg-gradient-to-r from-indigo-500 to-violet-500
                  shadow-lg shadow-indigo-500/25 dark:shadow-indigo-500/15
                  hover:shadow-indigo-500/40 transition-shadow"
              >
                Create Agent
              </motion.button>
            )}
          </motion.div>
        ) : (
          /* Agent cards */
          <div className="p-3 space-y-1.5">
            <AnimatePresence mode="popLayout">
              {filteredAgents.map((agent, index) => {
                const Icon = getAgentIcon(agent.type);
                const isSelected = selectedAgentId === agent.id;
                const isDeleting = deletingAgentId === agent.id;

                return (
                  <motion.div
                    key={agent.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
                    transition={{
                      delay: index * 0.04,
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSelectAgent(agent.id)}
                      className={`relative w-full p-3.5 flex items-start gap-3 rounded-2xl text-left group transition-all duration-200
                        ${isSelected
                          ? 'bg-gradient-to-br from-indigo-50/90 to-violet-50/70 dark:from-indigo-500/[0.08] dark:to-violet-500/[0.06] border border-indigo-300/50 dark:border-indigo-400/15 shadow-lg shadow-indigo-500/[0.07] dark:shadow-indigo-500/[0.04]'
                          : 'bg-white/40 dark:bg-white/[0.02] border border-transparent hover:bg-white/70 dark:hover:bg-white/[0.04] hover:border-gray-200/60 dark:hover:border-white/[0.06] hover:shadow-md hover:shadow-gray-200/30 dark:hover:shadow-black/10'
                        }`}
                    >
                      {/* Selected indicator bar */}
                      {isSelected && (
                        <motion.div
                          layoutId="selectedIndicator"
                          className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-gradient-to-b from-indigo-500 to-violet-500"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}

                      {/* Avatar */}
                      <div
                        className={`relative flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-semibold transition-transform duration-200 group-hover:scale-105
                          ${agent.type === 'website'
                            ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md shadow-indigo-500/25'
                            : 'bg-gradient-to-br from-violet-500 to-violet-600 shadow-md shadow-violet-500/25'
                          }`}
                      >
                        {agent.logo_url ? (
                          <img
                            src={agent.logo_url}
                            alt={agent.name}
                            className="w-full h-full rounded-xl object-cover"
                          />
                        ) : (
                          <span className="text-[13px]">{getAgentInitials(agent.name)}</span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <h3
                            className={`text-[13.5px] font-semibold truncate leading-snug
                              ${isSelected
                                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent'
                                : 'text-gray-900 dark:text-gray-100'
                              }`}
                          >
                            {agent.name}
                          </h3>
                          <Icon className="flex-shrink-0 h-3.5 w-3.5 text-gray-400/70 dark:text-gray-500" />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-1.5">
                          {agent.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-medium
                              ${agent.type === 'website'
                                ? 'bg-indigo-100/70 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-200/50 dark:ring-indigo-500/10'
                                : 'bg-violet-100/70 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-1 ring-violet-200/50 dark:ring-violet-500/10'
                              }`}
                          >
                            {agent.type}
                          </span>

                          {/* Delete action */}
                          <AnimatePresence mode="wait">
                            {showDeleteConfirm === agent.id ? (
                              <motion.div
                                key="confirm"
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.85 }}
                                className="flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    confirmDelete(agent.id);
                                  }}
                                  disabled={isDeleting}
                                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 transition-colors"
                                >
                                  {isDeleting ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    'Delete'
                                  )}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteConfirm(null);
                                  }}
                                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                                >
                                  Cancel
                                </button>
                              </motion.div>
                            ) : (
                              <motion.button
                                key="trash"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={(e) => handleDeleteAgent(agent.id, e)}
                                className="p-1 rounded-lg opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </motion.button>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="px-5 py-3.5 border-t border-indigo-100/60 dark:border-white/[0.06]">
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-400 dark:text-gray-500">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
          </span>
          {agents.length} {agents.length === 1 ? 'agent' : 'agents'} created
        </div>
      </div>
    </div>
  );
}
