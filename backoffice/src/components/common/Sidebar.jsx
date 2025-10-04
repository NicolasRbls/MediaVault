import React from 'react';
import { NavLink } from 'react-router-dom';

// Using Heroicons (included with DaisyUI/Tailwind)
const Icon = ({ path }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
);

const Sidebar = () => {
    const menuItems = [
        { path: '/', icon: 'M4 6h16M4 12h16M4 18h16', label: 'Tableau de Bord' },
        { path: '/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12a5.995 5.995 0 00-3-5.197', label: 'Utilisateurs' },
        { path: '/media', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z', label: 'Médias' },
        { path: '/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', label: 'Paramètres' },
    ];

    return (
        <div className="w-64 bg-base-200 text-base-content h-screen sticky top-0 flex flex-col">
            <div className="p-4 text-2xl font-bold border-b border-base-300">
                <a href="/">MediaVault</a>
            </div>
            <ul className="menu p-4 flex-grow">
                {menuItems.map(item => (
                    <li key={item.path}>
                        <NavLink to={item.path} className={({ isActive }) => isActive ? 'active' : ''}>
                            <Icon path={item.icon} />
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
            <div className="p-4 border-t border-base-300">
                {/* Theme Toggle will go here */}
            </div>
        </div>
    );
};

export default Sidebar;
