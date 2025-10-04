import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-base-100 text-base-content">
            <Toaster 
                position="top-right"
                toastOptions={{
                    className: 'bg-base-200 text-base-content',
                    style: {
                        border: '1px solid #4a4a4a',
                    },
                }}
            />
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-base-100 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
