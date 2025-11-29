'use client';

import { useAuth } from '@clerk/nextjs';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const useApi = () => {
    const { getToken } = useAuth();

    const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
        try {
            const token = await getToken();
            const headers = {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options.headers,
            };

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    };

    return {
        get: (endpoint: string) => apiRequest(endpoint, { method: 'GET' }),
        post: (endpoint: string, data: any) =>
            apiRequest(endpoint, {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        put: (endpoint: string, data: any) =>
            apiRequest(endpoint, {
                method: 'PUT',
                body: JSON.stringify(data),
            }),
        delete: (endpoint: string) =>
            apiRequest(endpoint, { method: 'DELETE' }),
    };
};
