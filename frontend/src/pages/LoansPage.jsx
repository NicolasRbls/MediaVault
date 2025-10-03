import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import LoanFormModal from '../components/loans/LoanFormModal';

const LoansPage = () => {
    const [activeLoans, setActiveLoans] = useState([]);
    const [loanHistory, setLoanHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToast } = useToast();

    const fetchLoans = async () => {
        try {
            setLoading(true);
            const [activeRes, historyRes] = await Promise.all([
                api.get('/loans'),
                api.get('/loans/history')
            ]);
            setActiveLoans(activeRes.data);
            setLoanHistory(historyRes.data);
        } catch (err) {
            addToast('Could not fetch loans.', 'error');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    const handleReturn = async (loanId) => {
        const returnDate = new Date().toISOString().split('T')[0];
        if (window.confirm('Are you sure you want to mark this as returned today?')) {
            try {
                await api.put(`/loans/${loanId}/return`, { actual_return_date: returnDate });
                addToast('Loan marked as returned!', 'success');
                fetchLoans();
            } catch (err) {
                addToast('Failed to mark as returned.', 'error');
            }
        }
    };

    const handleSaveLoan = async (formData) => {
        try {
            await api.post('/loans', formData);
            addToast('Loan saved successfully!', 'success');
            fetchLoans();
            setIsModalOpen(false);
        } catch (err) {
            addToast('Failed to save loan.', 'error');
        }
    };

    const LoanRow = ({ loan, isHistory = false }) => (
        <div className="bg-dark-alt p-4 rounded-lg flex items-center justify-between flex-wrap gap-4 shadow-md">
            <div className="flex items-center">
                <img src={loan.cover_image || `https://via.placeholder.com/64/dark/light?text=M`} alt={loan.title} className="w-16 h-16 rounded-md object-cover mr-4" />
                <div>
                    <p className="font-bold text-lg text-light">{loan.title}</p>
                    <p className="text-sm text-gray-text">Lent to: <span className="font-semibold">{loan.borrower_name}</span></p>
                    <p className="text-xs text-gray-text">Loaned on: {loan.loan_date}{isHistory && `, Returned on: ${loan.actual_return_date}`}</p>
                </div>
            </div>
            {loan.status === 'active' && (
                <button onClick={() => handleReturn(loan.id)} className="bg-secondary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Mark as Returned</button>
            )}
        </div>
    );

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Manage Loans</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">
                    Lend an Item
                </button>
            </div>

            <LoanFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveLoan}
            />

            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Active Loans ({activeLoans.length})</h2>
                {loading ? <p>Loading...</p> : activeLoans.length > 0 ? (
                    <div className="space-y-4">
                        {activeLoans.map(loan => <LoanRow key={loan.id} loan={loan} />)}
                    </div>
                ) : <p className="text-gray-text italic">No active loans.</p>}
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Loan History</h2>
                {loading ? <p>Loading...</p> : loanHistory.length > 0 ? (
                    <div className="space-y-4">
                        {loanHistory.map(loan => <LoanRow key={loan.id} loan={loan} isHistory={true} />)}
                    </div>
                ) : <p className="text-gray-text italic">No past loans.</p>}
            </div>
        </div>
    );
};

export default LoansPage;
