'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, AlertCircle, Sparkles, Code, X, Copy, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@/hooks/useChat';

interface ChatPanelProps {
    agentId: string | null;
    agentName?: string;
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

export default function ChatPanel({ agentId, agentName, onDeleteAgent }: ChatPanelProps) {
    const [inputMessage, setInputMessage] = useState('');
    const [showEmbedModal, setShowEmbedModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedFramework, setSelectedFramework] = useState<'react' | 'nextjs' | 'html'>('react');
    const [copiedCode, setCopiedCode] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    
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

    // Generate embed codes for different frameworks
    const getEmbedCode = () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        
        if (selectedFramework === 'react') {
            return `// AskAgentWidget.tsx
import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AskAgentWidget({ 
  agentId = "${agentId}",
  position = "bottom-right" 
}: { 
  agentId?: string;
  position?: "bottom-right" | "bottom-left";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('${apiUrl}/chat/widget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, content: input }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'assistant', 
          content: data.data.content 
        }]);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const positionClass = position === "bottom-left" ? "left-4" : "right-4";

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={\`fixed bottom-4 \${positionClass} w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform z-50\`}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={\`fixed bottom-20 \${positionClass} w-80 h-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200 dark:border-gray-700\`}>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-white font-semibold">
            ${agentName || 'AI Assistant'}
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map(msg => (
              <div key={msg.id} className={\`flex \${msg.role === 'user' ? 'justify-end' : 'justify-start'}\`}>
                <div className={\`max-w-[80%] px-3 py-2 rounded-xl \${
                  msg.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                }\`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-gray-500 text-sm">Typing...</div>}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}`;
        }
        
        if (selectedFramework === 'nextjs') {
            return `// components/AskAgentWidget.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AskAgentWidget({ 
  agentId = "${agentId}",
  position = "bottom-right" 
}: { 
  agentId?: string;
  position?: "bottom-right" | "bottom-left";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('${apiUrl}/chat/widget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, content: input }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'assistant', 
          content: data.data.content 
        }]);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const positionClass = position === "bottom-left" ? "left-4" : "right-4";

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={\`fixed bottom-4 \${positionClass} w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform z-50\`}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={\`fixed bottom-20 \${positionClass} w-80 h-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200 dark:border-gray-700\`}>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-white font-semibold">
            ${agentName || 'AI Assistant'}
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map(msg => (
              <div key={msg.id} className={\`flex \${msg.role === 'user' ? 'justify-end' : 'justify-start'}\`}>
                <div className={\`max-w-[80%] px-3 py-2 rounded-xl \${
                  msg.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                }\`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-gray-500 text-sm">Typing...</div>}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Usage in your layout.tsx or page.tsx:
// import AskAgentWidget from '@/components/AskAgentWidget';
// <AskAgentWidget agentId="${agentId}" position="bottom-right" />`;
        }
        
        // HTML/Vanilla JS
        return `<!-- Add this before </body> -->
<div id="askagent-widget"></div>
<script>
(function() {
  const AGENT_ID = "${agentId}";
  const API_URL = "${apiUrl}";
  const AGENT_NAME = "${agentName || 'AI Assistant'}";
  
  // Styles
  const style = document.createElement('style');
  style.textContent = \`
    #askagent-btn { position: fixed; bottom: 16px; right: 16px; width: 56px; height: 56px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 50%; border: none; cursor: pointer; box-shadow: 0 4px 20px rgba(59,130,246,0.4); display: flex; align-items: center; justify-content: center; font-size: 24px; z-index: 9999; transition: transform 0.2s; }
    #askagent-btn:hover { transform: scale(1.1); }
    #askagent-chat { position: fixed; bottom: 80px; right: 16px; width: 320px; height: 400px; background: #fff; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); display: none; flex-direction: column; overflow: hidden; z-index: 9999; font-family: system-ui, sans-serif; }
    #askagent-chat.open { display: flex; }
    #askagent-header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #fff; padding: 12px 16px; font-weight: 600; }
    #askagent-messages { flex: 1; overflow-y: auto; padding: 12px; }
    .askagent-msg { margin: 8px 0; max-width: 80%; padding: 8px 12px; border-radius: 12px; font-size: 14px; }
    .askagent-msg.user { background: #3b82f6; color: #fff; margin-left: auto; }
    .askagent-msg.assistant { background: #f3f4f6; color: #1f2937; }
    #askagent-input-area { padding: 12px; border-top: 1px solid #e5e7eb; display: flex; gap: 8px; }
    #askagent-input { flex: 1; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 12px; font-size: 14px; outline: none; }
    #askagent-input:focus { border-color: #3b82f6; }
    #askagent-send { padding: 8px 16px; background: #3b82f6; color: #fff; border: none; border-radius: 12px; cursor: pointer; font-size: 14px; }
    #askagent-send:hover { background: #2563eb; }
    #askagent-send:disabled { opacity: 0.5; cursor: not-allowed; }
    @media (prefers-color-scheme: dark) {
      #askagent-chat { background: #1f2937; }
      .askagent-msg.assistant { background: #374151; color: #f9fafb; }
      #askagent-input-area { border-color: #374151; }
      #askagent-input { background: #374151; border-color: #4b5563; color: #f9fafb; }
    }
  \`;
  document.head.appendChild(style);
  
  // HTML
  const container = document.getElementById('askagent-widget');
  container.innerHTML = \`
    <button id="askagent-btn">💬</button>
    <div id="askagent-chat">
      <div id="askagent-header">\${AGENT_NAME}</div>
      <div id="askagent-messages"></div>
      <div id="askagent-input-area">
        <input id="askagent-input" placeholder="Type a message..." />
        <button id="askagent-send">Send</button>
      </div>
    </div>
  \`;
  
  // Logic
  const btn = document.getElementById('askagent-btn');
  const chat = document.getElementById('askagent-chat');
  const input = document.getElementById('askagent-input');
  const send = document.getElementById('askagent-send');
  const messages = document.getElementById('askagent-messages');
  
  btn.onclick = () => { 
    chat.classList.toggle('open'); 
    btn.textContent = chat.classList.contains('open') ? '✕' : '💬';
  };
  
  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    
    messages.innerHTML += \`<div class="askagent-msg user">\${text}</div>\`;
    input.value = '';
    send.disabled = true;
    messages.scrollTop = messages.scrollHeight;
    
    try {
      const res = await fetch(API_URL + '/chat/widget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: AGENT_ID, content: text })
      });
      const data = await res.json();
      if (data.success) {
        messages.innerHTML += \`<div class="askagent-msg assistant">\${data.data.content}</div>\`;
      }
    } catch (err) {
      messages.innerHTML += \`<div class="askagent-msg assistant">Sorry, something went wrong.</div>\`;
    }
    send.disabled = false;
    messages.scrollTop = messages.scrollHeight;
  }
  
  send.onclick = sendMessage;
  input.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
})();
</script>`;
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

    if (!agentId) {
        return (
            <div className="h-full flex items-center justify-center bg-transparent">
                <motion.div 
                    className="text-center px-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div 
                        className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/30"
                        animate={{
                            rotate: [0, 5, 0, -5, 0],
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Bot className="h-12 w-12 text-white" />
                    </motion.div>
                    <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Welcome to AskAgent
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-lg">
                        Select an agent from the sidebar to start a conversation, or create a new agent to get started.
                    </p>
                    <motion.div
                        className="mt-8 flex items-center justify-center gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {['🌐 Website', '📄 Documents', '🤖 AI Chat'].map((feature, index) => (
                            <motion.div
                                key={feature}
                                className="flex flex-col items-center gap-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                            >
                                <div className="text-2xl">{feature.split(' ')[0]}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{feature.split(' ')[1]}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Chat Header */}
            <motion.div 
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 px-6 py-4 flex items-center gap-3 shadow-sm"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/30">
                    {agentName?.substring(0, 2).toUpperCase() || 'AI'}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        {agentName || 'AI Agent'}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Online</p>
                    </div>
                </div>
                {/* Embed Button */}
                <button
                    onClick={() => setShowEmbedModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200"
                >
                    <Code className="w-4 h-4" />
                    <span>Embed</span>
                </button>
                
                {/* Delete Button */}
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-sm font-medium rounded-xl transition-all duration-200"
                    title="Delete Agent"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </motion.div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDeleteModal(false)}
                        />
                        <motion.div
                            className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trash2 className="h-8 w-8 text-red-500" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    Delete Agent?
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                    This will permanently delete <strong>{agentName}</strong> and all its data. This action cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
                                        className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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

            {/* Embed Modal */}
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
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowEmbedModal(false)}
                        />
                        
                        {/* Modal */}
                        <motion.div
                            className="relative w-full max-w-3xl max-h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                                <div>
                                    <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
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
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            
                            {/* Framework Selector */}
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Select your framework:
                                </label>
                                <div className="flex gap-3">
                                    {[
                                        { id: 'react', name: 'React', icon: '⚛️' },
                                        { id: 'nextjs', name: 'Next.js', icon: '▲' },
                                        { id: 'html', name: 'HTML/JS', icon: '🌐' },
                                    ].map((fw) => (
                                        <button
                                            key={fw.id}
                                            onClick={() => setSelectedFramework(fw.id as 'react' | 'nextjs' | 'html')}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                                                selectedFramework === fw.id
                                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
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
                                <div className="relative">
                                    <div className="absolute top-3 right-3 z-10">
                                        <button
                                            onClick={() => handleCopyCode(getEmbedCode())}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                                copiedCode
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            {copiedCode ? (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" />
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed">
                                        <code>{getEmbedCode()}</code>
                                    </pre>
                                </div>
                            </div>
                            
                            {/* Footer Instructions */}
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
                                <div className="flex items-start gap-3">
                                    <Sparkles className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {selectedFramework === 'html' ? (
                                            <p>Paste this code just before the closing <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">&lt;/body&gt;</code> tag in your HTML file.</p>
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

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto bg-transparent px-4 py-6 space-y-4">
                {/* Loading History */}
                {loading && messages.length === 0 && (
                    <div className="flex justify-center items-center h-full">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="w-12 h-12 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full"></div>
                        </motion.div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <motion.div 
                        className="flex justify-center items-center p-4"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-red-200/50 dark:border-red-800/50">
                            <AlertCircle className="h-5 w-5" />
                            <span className="font-medium">{error}</span>
                        </div>
                    </motion.div>
                )}

                {/* Messages */}
                <AnimatePresence mode="popLayout">
                    {messages.map((message, index) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-3 max-w-[80%] md:max-w-[70%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                }`}>
                                {/* Avatar */}
                                <motion.div 
                                    className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg ${message.role === 'user'
                                            ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-orange-500/30'
                                            : 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-blue-500/30'
                                        }`}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    {message.role === 'user' ? (
                                        <User className="h-4 w-4" />
                                    ) : (
                                        <Bot className="h-4 w-4" />
                                    )}
                                </motion.div>

                                {/* Message Bubble */}
                                <div>
                                    <motion.div 
                                        className={`px-4 py-3 rounded-2xl backdrop-blur-sm ${message.role === 'user'
                                                ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-tr-sm shadow-lg shadow-orange-500/20'
                                                : 'bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 rounded-tl-sm shadow-lg border border-gray-200/50 dark:border-gray-700/50'
                                            }`}
                                        whileHover={{ scale: 1.01 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
                                        
                                        {/* Show metadata for assistant messages */}
                                        {message.role === 'assistant' && message.metadata && (
                                            <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3">
                                                {message.metadata.chunksRetrieved !== undefined && (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                                                        <Sparkles className="h-3 w-3" />
                                                        {message.metadata.chunksRetrieved} sources
                                                    </span>
                                                )}
                                                {message.metadata.processingTimeMs !== undefined && (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100/80 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full font-medium">
                                                        ⚡ {(message.metadata.processingTimeMs / 1000).toFixed(1)}s
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                    <p className={`text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium ${message.role === 'user' ? 'text-right' : 'text-left'
                                        }`}>
                                        {formatMessageTime(message.created_at)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </AnimatePresence>

                {/* Sending Indicator */}
                {sending && (
                    <motion.div 
                        className="flex justify-start"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div className="flex gap-3 max-w-[80%] md:max-w-[70%]">
                            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                <Bot className="h-4 w-4" />
                            </div>
                            <div className="px-5 py-4 rounded-2xl rounded-tl-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                                <div className="flex gap-1.5">
                                    <motion.div 
                                        className="w-2 h-2 bg-blue-500 rounded-full"
                                        animate={{ y: [0, -8, 0] }}
                                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                    <motion.div 
                                        className="w-2 h-2 bg-purple-500 rounded-full"
                                        animate={{ y: [0, -8, 0] }}
                                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                                    />
                                    <motion.div 
                                        className="w-2 h-2 bg-pink-500 rounded-full"
                                        animate={{ y: [0, -8, 0] }}
                                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 px-4 py-4">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                    <textarea
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                        placeholder={agentId ? "Type a message..." : "Select an agent to start chatting"}
                        rows={1}
                        className="flex-1 resize-none px-5 py-4 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent max-h-32 transition-all"
                        disabled={sending || !agentId}
                    />
                    <motion.button
                        type="submit"
                        disabled={!inputMessage.trim() || sending || !agentId}
                        whileHover={{ scale: sending || !inputMessage.trim() ? 1 : 1.05 }}
                        whileTap={{ scale: sending || !inputMessage.trim() ? 1 : 0.95 }}
                        className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-700 dark:disabled:to-gray-600 text-white rounded-2xl flex items-center justify-center transition-all disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 disabled:shadow-none"
                    >
                        {sending ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
