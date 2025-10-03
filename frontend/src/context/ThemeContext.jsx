import React, { createContext, useState, useMemo, useEffect } from 'react';

export const ThemeContext = createContext();

// Function to get the initial theme from localStorage or system preference
const getInitialTheme = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedPrefs = window.localStorage.getItem('color-theme');
        if (typeof storedPrefs === 'string') {
            return storedPrefs;
        }

        const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
        if (userMedia.matches) {
            return 'mediavault_dark';
        }
    }
    return 'light'; // default theme
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(getInitialTheme);

    const toggleTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'mediavault_dark' ? 'light' : 'mediavault_dark';
            window.localStorage.setItem('color-theme', newTheme);
            return newTheme;
        });
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};