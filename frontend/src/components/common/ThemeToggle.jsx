import React, { useContext } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';

const ThemeToggle = ({ className }) => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <div className={className}>
            <motion.button
                onClick={toggleTheme}
                className="btn btn-ghost btn-circle"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {theme === 'light' ? <FiMoon className="h-6 w-6" /> : <FiSun className="h-6 w-6" />}
            </motion.button>
        </div>
    );
};

export default ThemeToggle;
