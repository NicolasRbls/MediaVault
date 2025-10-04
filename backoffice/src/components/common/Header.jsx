import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAdminAuth } from '../../context/AuthContext';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { admin, logout } = useAdminAuth();

    const SunIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    );

    const MoonIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
    );

    return (
        <header className="bg-base-100/50 backdrop-blur-lg shadow-sm p-4 flex justify-end items-center gap-4">
            <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>

            <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full bg-primary text-primary-content">
                        <span>{admin?.username?.charAt(0).toUpperCase()}</span>
                    </div>
                </label>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52">
                    <li>
                        <a className="justify-between">
                            Profil
                            <span className="badge">Bientôt</span>
                        </a>
                    </li>
                    <li><a>Paramètres</a></li>
                    <li><button onClick={logout}>Déconnexion</button></li>
                </ul>
            </div>
        </header>
    );
};

export default Header;
