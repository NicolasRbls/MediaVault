import React from 'react';
import { useAdminAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Header = () => {
    const { admin, logout } = useAdminAuth();

    return (
        <header className="bg-base-100/50 backdrop-blur-lg shadow-sm p-4 flex justify-end items-center gap-4">
            <ThemeToggle />

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
