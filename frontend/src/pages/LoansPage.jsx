import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import LoanFormModal from '../components/loans/LoanFormModal';
import { FiPlus } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const API_URL = 'http://localhost:5000';

const LoansPage = () => {
    const [activeLoans, setActiveLoans] = useState([]);
    const [loanHistory, setLoanHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToast } = useToast();
    const { t } = useTranslation();

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

    const LoanRow = ({ loan, isHistory = false }) => {
        const placeholderImage = `https://via.placeholder.com/64x64/0D0D1A/8A2BE2?text=${encodeURIComponent(loan.title.charAt(0))}`;
        const imageUrl = loan.cover_image ? `${API_URL}${loan.cover_image}` : placeholderImage;

        return (
            <div className="bg-base-200 p-4 rounded-lg flex items-center justify-between flex-wrap gap-4 shadow-md border border-white/10">
                <div className="flex items-center">
                    <img src={imageUrl} alt={loan.title} className="w-16 h-16 rounded-md object-cover mr-4" onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }} />
                    <div>
                        <p className="font-bold text-lg text-base-content">{loan.title}</p>
                        <p className="text-sm text-base-content/70">{t('lent_to')} <span className="font-semibold">{loan.borrower_name}</span></p>
                        <p className="text-xs text-base-content/70">{t('loaned_on')} {loan.loan_date}{isHistory && `, ${t('returned_on')} ${loan.actual_return_date}`}</p>
                    </div>
                </div>
                {loan.status === 'active' && (
                    <button onClick={() => handleReturn(loan.id)} className="btn btn-secondary btn-sm">{t('mark_as_returned')}</button>
                )}
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">{t('manage_loans')}</h1>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary gap-2">
                    <FiPlus />
                    {t('lend_an_item')}
                </button>
            </div>

            <LoanFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveLoan}
            />

            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4">{t('active_loans_count', { count: activeLoans.length })}</h2>
                {loading ? <div className="text-center"><span className="loading loading-spinner"></span></div> : activeLoans.length > 0 ? (
                    <div className="space-y-4">
                        {activeLoans.map(loan => <LoanRow key={loan.id} loan={loan} />)}
                    </div>
                ) : <p className="text-base-content/70 italic">{t('no_active_loans')}</p>}
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">{t('loan_history')}</h2>
                {loading ? <div className="text-center"><span className="loading loading-spinner"></span></div> : loanHistory.length > 0 ? (
                    <div className="space-y-4">
                        {loanHistory.map(loan => <LoanRow key={loan.id} loan={loan} isHistory={true} />)}
                    </div>
                ) : <p className="text-base-content/70 italic">{t('no_past_loans')}</p>}
            </div>
        </div>
    );
};

export default LoansPage;
