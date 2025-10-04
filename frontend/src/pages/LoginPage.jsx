import React, { useState, useContext, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/common/ThemeToggle';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/common/LanguageSwitcher';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const cardRef = useRef(null);
    const { t } = useTranslation();

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardRef.current.style.setProperty('--x', `${x}px`);
        cardRef.current.style.setProperty('--y', `${y}px`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
            <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                <LanguageSwitcher />
                <ThemeToggle />
            </div>
            <div className="absolute top-0 left-0 p-6">
                <h1 className="text-2xl font-bold text-base-content">MediaVault</h1>
            </div>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0, 0.55, 0.45, 1] }}
            >
                <div 
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    className="card-aurora card w-full max-w-md bg-base-200/30 backdrop-blur-xl shadow-2xl border border-base-content/10"
                >
                    <div className="card-body">
                        <h2 className="card-title text-3xl justify-center mb-4">{t('login')}</h2>
                        
                        {error && (
                            <div role="alert" className="alert alert-error"><FiAlertCircle /><span>{error}</span></div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-control">
                                <label className="label"><span className="label-text">{t('email')}</span></label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input input-bordered w-full bg-base-200/50" />
                            </div>
                            <div className="form-control mt-4">
                                <label className="label"><span className="label-text">{t('password')}</span></label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input input-bordered w-full bg-base-200/50" />
                            </div>
                            <div className="form-control mt-6">
                                <button type="submit" className="btn btn-primary w-full">{t('login')}</button>
                            </div>
                        </form>
                        <p className="mt-4 text-center text-sm">
                            {t('dont_have_account')} <Link to="/register" className="link link-secondary">{t('register_here')}</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
