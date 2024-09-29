import { useState, useCallback } from 'react';

interface UseApiReturn {
    fetchApi: (url: string, options?: RequestInit) => Promise<any>;
    loading: boolean;
    error: string | null;
}

export const useApi = (): UseApiReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchApi = useCallback(async (url: string, options: RequestInit = {}): Promise<any> => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (token) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`
            };
        }

        try {
            const response = await fetch(url, options);
            
            if (response.status === 401) {
                // Token expiré ou invalide
                localStorage.removeItem('token');
                throw new Error('Session expirée. Veuillez vous reconnecter.');
            }

            if (!response.ok) {
                throw new Error('Une erreur est survenue');
            }

            const data = await response.json();
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { fetchApi, loading, error };
};