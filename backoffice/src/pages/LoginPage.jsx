import React, { useState } from 'react';
import { useAdminAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, error, admin } = useAdminAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await login(email, password);
        if (success) {
            navigate('/');
        } else {
            setLoading(false);
        }
    };

    // If user is already logged in, redirect to dashboard
    if (admin) {
        return <Navigate to="/" />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Back Office</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Connectez-vous à votre panneau d'administration</p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <input 
                            type="email" 
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 text-gray-900 bg-gray-200 border-transparent rounded-md focus:border-blue-500 focus:bg-white focus:ring-0 dark:bg-gray-700 dark:text-white"
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className="relative">
                        <input 
                            type="password" 
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 text-gray-900 bg-gray-200 border-transparent rounded-md focus:border-blue-500 focus:bg-white focus:ring-0 dark:bg-gray-700 dark:text-white"
                            placeholder="Mot de passe"
                            required
                        />
                    </div>
                    <div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-sm text-center text-red-600 dark:text-red-400">{error}</p>}
            </div>
        </div>
    );
};

export default LoginPage;
