import React from 'react';
import Navbar from './Navbar';
import AnimatedBackground from './AnimatedBackground';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();

    const pageVariants = {
        initial: {
            opacity: 0,
            y: 20,
        },
        in: {
            opacity: 1,
            y: 0,
        },
        out: {
            opacity: 0,
            y: -20,
        },
    };

    const pageTransition = {
        type: 'tween',
        ease: 'anticipate',
        duration: 0.5,
    };

    return (
        <div className="min-h-screen bg-transparent" data-theme="dark">
            <AnimatedBackground />
            <Navbar />
            <AnimatePresence mode="wait">
                <motion.main
                    key={location.pathname} // This is crucial for page transitions
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                    className="container mx-auto p-4"
                >
                    {children}
                </motion.main>
            </AnimatePresence>
        </div>
    );
};

export default Layout;