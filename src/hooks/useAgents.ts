'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Agent {
    id: string;
    user_id: string;
    name: string;
    type: 'website' | 'document';
    description: string;
    logo_url?: string;
    source_url?: string;
    vector_store_id?: string;
    metadata?: any;
    created_at: string;
    updated_at?: string;
}

export interface CreateAgentResponse {
    success: boolean;
    message: string;
    status: 'processing';
}

export interface UploadDocumentParams {
    file: File;
    name: string;
    description?: string;
}

export const useAgents = () => {
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadDocument = async ({ file, name, description }: UploadDocumentParams): Promise<CreateAgentResponse> => {
        setLoading(true);
        setError(null);

        try {
            const token = await getToken();

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('document', file);
            formData.append('name', name);
            if (description) {
                formData.append('description', description);
            }

            const response = await fetch(`${API_BASE_URL}/agents/upload-document`, {
                method: 'POST',
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    // Don't set Content-Type for FormData - browser will set it with boundary
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Upload failed: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload document';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const scrapeWebsite = async (url: string, name: string, description?: string): Promise<CreateAgentResponse> => {
        setLoading(true);
        setError(null);

        try {
            const token = await getToken();

            const response = await fetch(`${API_BASE_URL}/agents/scrape-website`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ url, name, description }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Scraping failed: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to scrape website';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchAgents = async (): Promise<Agent[]> => {
        setLoading(true);
        setError(null);

        try {
            const token = await getToken();

            const response = await fetch(`${API_BASE_URL}/agents`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch agents: ${response.status}`);
            }

            const data = await response.json();
            return data.data || [];
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch agents';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteAgent = async (agentId: string): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const token = await getToken();

            const response = await fetch(`${API_BASE_URL}/agents/${agentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Delete failed: ${response.status}`);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete agent';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const addContext = async (agentId: string, file: File): Promise<CreateAgentResponse> => {
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            const formData = new FormData();
            formData.append('document', file);
            const response = await fetch(`${API_BASE_URL}/agents/${agentId}/add-context`, {
                method: 'POST',
                headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: formData,
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Failed: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to add context';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        uploadDocument,
        scrapeWebsite,
        fetchAgents,
        deleteAgent,
        addContext,
        loading,
        error,
    };
};
