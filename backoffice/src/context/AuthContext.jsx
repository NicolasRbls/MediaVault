import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
    return useContext(AdminAuthContext);
}

export const AdminAuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            api.get('/auth/profile').then(res => {
                if (res.data.role === 'admin') {
                    setAdmin(res.data);
                } else {
                    localStorage.removeItem('admin_token');
                }
            }).catch(() => {
                localStorage.removeItem('admin_token');
            }).finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            const res = await api.post('/auth/login', { email, password });
            const { token, user } = res.data;

            if (user.role !== 'admin') {
                setError('Accès refusé. Vous n\'êtes pas un administrateur.');
                return false;
            }

            localStorage.setItem('admin_token', token);
            setAdmin(user);
            return true;

        } catch (err) {
            setError(err.response?.data?.message || 'Échec de la connexion.');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('admin_token');
        setAdmin(null);
    };

    const value = {
        admin,
        loading,
        error,
        login,
        logout
    };

    return (
        <AdminAuthContext.Provider value={value}>
            {!loading && children}
        </AdminAuthContext.Provider>
    );
};
