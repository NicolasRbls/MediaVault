import React, { createContext, useState, useCallback } from 'react';
import ToastContainer from '../components/common/Toast';

const ToastContext = createContext();

let id = 1;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        setToasts(toasts => [...toasts, { id: id++, message, type }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(toasts => toasts.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    return React.useContext(ToastContext);
};
