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
}

export default function AgentSidebar({
  selectedAgentId,
  onSelectAgent,
  onAddAgent,
  isMobileOpen,
  onCloseMobile,
}: AgentSidebarProps) {
  const { fetchAgents, deleteAgent, loading } = useAgents();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [deletingAgentId, setDeletingAgentId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Fetch agents on mount
  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const fetchedAgents = await fetchAgents();
      setAgents(fetchedAgents);
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  // Filter agents based on search query
  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteAgent = async (agentId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting the agent when clicking delete
    setShowDeleteConfirm(agentId);
  };

  const confirmDelete = async (agentId: string) => {
    try {
      setDeletingAgentId(agentId);
      await deleteAgent(agentId);
      setAgents(prev => prev.filter(a => a.id !== agentId));
      if (selectedAgentId === agentId) {
        onSelectAgent(''); // Deselect if the deleted agent was selected
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              My Agents
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </motion.button>
            
            {/* User Button */}
            <div className="flex items-center">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9"
                  }
                }}
              />
            </div>
            
            {/* Add Agent Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddAgent}
              className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl transition-all shadow-lg shadow-blue-500/30"
              title="Add New Agent"
            >
              <Plus className="h-5 w-5" />
            </motion.button>
            {isMobileOpen && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCloseMobile}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
              >
                <X className="h-5 w-5" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-sm transition-all"
          />
        </motion.div>
      </div>

      {/* Agents List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-12 h-12 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full"></div>
            </motion.div>
          </div>
        ) : filteredAgents.length === 0 ? (
          <motion.div 
            className="flex flex-col items-center justify-center h-64 px-4 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Plus className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {searchQuery ? 'No agents found' : 'No agents yet'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-xs">
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Create your first AI agent to get started with intelligent conversations'}
            </p>
            {!searchQuery && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAddAgent}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/30"
              >
                Create Agent
              </motion.button>
            )}
          </motion.div>
        ) : (
          <div className="p-4 space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredAgents.map((agent, index) => {
                const Icon = getAgentIcon(agent.type);
                const isSelected = selectedAgentId === agent.id;

                return (
                  <motion.button
                    key={agent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectAgent(agent.id)}
                    className={`w-full p-4 flex items-start gap-3 rounded-2xl transition-all text-left group ${
                      isSelected 
                        ? 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 shadow-xl shadow-blue-500/10 border-2 border-blue-500/20' 
                        : 'bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg'
                    }`}
                  >
                    {/* Avatar/Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg transition-transform group-hover:scale-110 ${
                      agent.type === 'website' 
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/30' 
                        : 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/30'
                    }`}>
                      {agent.logo_url ? (
                        <img
                          src={agent.logo_url}
                          alt={agent.name}
                          className="w-full h-full rounded-xl object-cover"
                        />
                      ) : (
                        getAgentInitials(agent.name)
                      )}
                    </div>

                    {/* Agent Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold truncate ${
                          isSelected ? 'bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent' : 'text-gray-900 dark:text-white'
                        }`}>
                          {agent.name}
                        </h3>
                        <Icon className="flex-shrink-0 h-3.5 w-3.5 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {agent.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm ${
                          agent.type === 'website'
                            ? 'bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50'
                            : 'bg-purple-100/80 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50'
                        }`}>
                          {agent.type}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-200/50 dark:border-gray-800/50">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center font-medium">
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></span>
            {agents.length} {agents.length === 1 ? 'agent' : 'agents'} created
          </span>
        </div>
      </div>
    </div>
  );
}
