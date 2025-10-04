import React from 'react';
import Navbar from './Navbar';
import AnimatedBackground from './AnimatedBackground';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-transparent" data-theme="dark">
            <Navbar />
            <main className="container mx-auto p-4">
                {children}
            </main>
        </div>
    );
};

export default Layout;
