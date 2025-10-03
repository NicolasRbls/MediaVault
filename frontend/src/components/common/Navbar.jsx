import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { FiMenu, FiLogOut, FiLogIn, FiUserPlus, FiSun, FiMoon } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';

const NavItem = ({ children }) => (
    <motion.li whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}>
        {children}
    </motion.li>
);

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = (
        <>
            <NavItem><Link to="/library">Library</Link></NavItem>
            <NavItem><Link to="/collections">Collections</Link></NavItem>
            <NavItem><Link to="/loans">Loans</Link></NavItem>
            <NavItem><Link to="/wishlist">Wishlist</Link></NavItem>
            <NavItem><Link to="/stats">Stats</Link></NavItem>
        </>
    );

    return (
        <div className="navbar bg-base-100/50 backdrop-blur-lg shadow-lg sticky top-0 z-50 rounded-b-lg border-b border-white/10">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <FiMenu className="h-5 w-5" />
                    </label>
                    {user && (
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100/80 backdrop-blur-lg rounded-box w-52">
                            {navLinks}
                        </ul>
                    )}
                </div>
                <motion.div whileHover={{ scale: 1.05 }}>
                    <Link to="/" className="btn btn-ghost normal-case text-xl text-gradient-primary">MediaVault</Link>
                </motion.div>
            </div>
            <div className="navbar-center hidden lg:flex">
                {user && (
                    <ul className="menu menu-horizontal px-1">
                        {navLinks}
                    </ul>
                )}
            </div>
            <div className="navbar-end gap-2">
                <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
                    {theme === 'light' ? <FiMoon className="h-5 w-5" /> : <FiSun className="h-5 w-5" />}
                </button>
                {user ? (
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout} className="btn btn-primary gap-2"><FiLogOut /> Logout</motion.button>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link to="/login" className="btn btn-ghost gap-2"><FiLogIn /> Login</Link>
                        <Link to="/register" className="btn btn-primary gap-2"><FiUserPlus /> Register</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
