export type Framework = 'react' | 'nextjs' | 'html';

interface EmbedCodeParams {
    agentId: string | null;
    agentName?: string;
    apiUrl: string;
}

export function getReactEmbedCode({ agentId, agentName, apiUrl }: EmbedCodeParams): string {
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

export function getNextjsEmbedCode({ agentId, agentName, apiUrl }: EmbedCodeParams): string {
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

export function getHtmlEmbedCode({ agentId, agentName, apiUrl }: EmbedCodeParams): string {
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
}

export function getEmbedCode(framework: Framework, params: EmbedCodeParams): string {
    switch (framework) {
        case 'react':   return getReactEmbedCode(params);
        case 'nextjs':  return getNextjsEmbedCode(params);
        case 'html':    return getHtmlEmbedCode(params);
    }
}
