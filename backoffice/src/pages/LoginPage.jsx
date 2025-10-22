import React, { useState } from 'react';
import { useAdminAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import ThemeToggle from '../components/common/ThemeToggle';

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
        <div className="relative flex items-center justify-center min-h-screen bg-base-200">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <div className="w-full max-w-md p-8 space-y-8 bg-base-100 rounded-lg shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-base-content">Back Office</h1>
                    <p className="mt-2 text-base-content/80">Connectez-vous à votre panneau d'administration</p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <input 
                            type="email" 
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 text-base-content bg-base-300 border-transparent rounded-md focus:border-primary focus:bg-base-100 focus:ring-0"
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
                            className="w-full px-4 py-2 text-base-content bg-base-300 border-transparent rounded-md focus:border-primary focus:bg-base-100 focus:ring-0"
                            placeholder="Mot de passe"
                            required
                        />
                    </div>
                    <div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full px-4 py-2 font-semibold text-white btn btn-primary rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                        >
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-sm text-center text-error">{error}</p>}
            </div>
        </div>
    );
};

export default LoginPage;
