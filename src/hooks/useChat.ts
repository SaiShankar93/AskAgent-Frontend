'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Message {
    id: string;
    agent_id: string;
    role: 'user' | 'assistant';
    content: string;
    metadata?: {
        model?: string;
        tokensUsed?: number;
        chunksRetrieved?: number;
        averageSimilarity?: number;
        sources?: string[];
        processingTimeMs?: number;
        error?: string;
    };
    created_at: string;
}

export interface SendMessageResponse {
    success: boolean;
    data: {
        userMessage: Message;
        assistantMessage: Message;
        metadata?: {
            processingTimeMs: number;
            chunksRetrieved: number;
            tokensUsed: number;
        };
    };
    error?: string;
    message?: string;
}

export interface ChatHistoryResponse {
    success: boolean;
    data: Message[];
    count: number;
}

export const useChat = (agentId: string | null) => {
    const { getToken } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch chat history for an agent
     */
    const fetchHistory = useCallback(async (limit: number = 50) => {
        if (!agentId) return;

        setLoading(true);
        setError(null);

        try {
            const token = await getToken();
            const response = await fetch(
                `${API_BASE_URL}/chat/${agentId}/history?limit=${limit}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            const result: ChatHistoryResponse = await response.json();

            if (result.success) {
                setMessages(result.data);
            } else {
                throw new Error(result.data as any || 'Failed to fetch chat history');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch messages';
            setError(errorMessage);
            console.error('Error fetching chat history:', err);
        } finally {
            setLoading(false);
        }
    }, [agentId, getToken]);

    /**
     * Send a message and get RAG response
     */
    const sendMessage = useCallback(async (content: string): Promise<Message | null> => {
        if (!agentId || !content.trim()) return null;

        setSending(true);
        setError(null);

        // Create optimistic user message to show immediately
        const optimisticUserMessage: Message = {
            id: `temp-${Date.now()}`,
            agent_id: agentId,
            role: 'user',
            content: content.trim(),
            created_at: new Date().toISOString(),
        };

        // Add user message immediately (optimistic update)
        setMessages(prev => [...prev, optimisticUserMessage]);

        try {
            const token = await getToken();
            const response = await fetch(`${API_BASE_URL}/chat/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    agentId,
                    content: content.trim(),
                }),
            });

            const result: SendMessageResponse = await response.json();

            if (result.success && result.data) {
                // Replace optimistic user message with real one and add assistant message
                setMessages(prev => {
                    // Remove the optimistic message
                    const withoutOptimistic = prev.filter(m => m.id !== optimisticUserMessage.id);
                    // Add real messages
                    return [
                        ...withoutOptimistic,
                        result.data.userMessage,
                        result.data.assistantMessage,
                    ];
                });

                return result.data.assistantMessage;
            } else {
                // If there's an error message, try to add it to chat
                if (!result.success && result.message) {
                    const errorMsg: Message = {
                        id: `error-${Date.now()}`,
                        agent_id: agentId,
                        role: 'assistant',
                        content: result.message,
                        metadata: { error: result.error },
                        created_at: new Date().toISOString(),
                    };
                    setMessages(prev => [...prev, errorMsg]);
                }
                
                throw new Error(result.message || result.error || 'Failed to send message');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
            setError(errorMessage);
            console.error('Error sending message:', err);
            return null;
        } finally {
            setSending(false);
        }
    }, [agentId, getToken]);

    /**
     * Clear chat history (local only)
     */
    const clearMessages = useCallback(() => {
        setMessages([]);
        setError(null);
    }, []);

    /**
     * Add a message to local state (for optimistic UI updates)
     */
    const addMessage = useCallback((message: Message) => {
        setMessages(prev => [...prev, message]);
    }, []);

    return {
        messages,
        loading,
        sending,
        error,
        fetchHistory,
        sendMessage,
        clearMessages,
        addMessage,
    };
};
