import { useState, useEffect } from 'react';

type UserInfo = {
    username: string;
    avatarUrl: string;
    handcashId: string;
}

export function useUser() {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setError(null);
                const response = await fetch('/api/auth/userInfo');
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    setUser(null);
                    setError('Failed to fetch user data');
                }
            } catch (error) {
                setUser(null);
                setError('Network error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading, error };
} 