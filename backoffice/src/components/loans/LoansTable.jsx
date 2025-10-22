import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Pagination from '../common/Pagination';
import SearchInput from '../common/SearchInput';
import EditLoanModal from './EditLoanModal';

const LoansTable = () => {
    const [loans, setLoans] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);

    // Debounce search term
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timerId);
    }, [searchTerm]);

    const fetchLoans = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(`/admin/loans?page=${currentPage}&search=${debouncedSearchTerm}`);
            setLoans(res.data.data);
            setPagination(res.data.pagination);
        } catch (err) {
            setError('Failed to fetch loans.');
            toast.error('Impossible de charger les prêts.');
        } finally {
            setLoading(false);
        }
    }, [currentPage, debouncedSearchTerm]);

    useEffect(() => {
        fetchLoans();
    }, [fetchLoans]);

    const openEditModal = (loanItem) => {
        setSelectedLoan(loanItem);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedLoan(null);
        setIsEditModalOpen(false);
    };

    const handleSaveLoan = async (loanId, updatedData) => {
        const promise = api.put(`/admin/loans/${loanId}`, updatedData);
        toast.promise(promise, {
            loading: 'Mise à jour du prêt...',
            success: () => {
                fetchLoans();
                closeEditModal();
                return 'Prêt mis à jour avec succès !';
            },
            error: 'Échec de la mise à jour.',
        });
    };

    const handleDeleteLoan = async (loanId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce prêt ? Cette action est irréversible.')) {
            const promise = api.delete(`/admin/loans/${loanId}`);
            toast.promise(promise, {
                loading: 'Suppression du prêt...',
                success: () => {
                    fetchLoans();
                    return 'Prêt supprimé avec succès !';
                },
                error: 'Échec de la suppression.',
            });
        }
    };

    return (
        <>
            <EditLoanModal 
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                onSave={handleSaveLoan}
                loanItem={selectedLoan}
            />
            <div className="mb-4">
                <SearchInput 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher par emprunteur..."
                />
            </div>

            {loading && loans.length === 0 ? (
                <div className="text-center p-8"><span className="loading loading-spinner"></span></div>
            ) : error ? (
                <div className="alert alert-error">{error}</div>
            ) : (
                <>
                    <div className="overflow-x-auto bg-base-200 rounded-lg shadow-lg">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Média</th>
                                    <th>Emprunteur</th>
                                    <th>Date de prêt</th>
                                    <th>Date de retour prévue</th>
                                    <th>Date de retour réelle</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loans.map(item => (
                                    <tr key={item.id}>
                                        <th>{item.id}</th>
                                        <td>{item.media_title}</td>
                                        <td>{item.borrower_name}</td>
                                        <td>{new Date(item.loan_date).toLocaleDateString()}</td>
                                        <td>{item.expected_return_date ? new Date(item.expected_return_date).toLocaleDateString() : 'N/A'}</td>
                                        <td>{item.actual_return_date ? new Date(item.actual_return_date).toLocaleDateString() : 'N/A'}</td>
                                        <td><span className={`badge ${item.status === 'active' ? 'badge-info' : item.status === 'returned' ? 'badge-success' : 'badge-warning'}`}>{item.status}</span></td>
                                        <td className="flex gap-2">
                                            <button onClick={() => openEditModal(item)} className="btn btn-sm btn-outline btn-info">Modifier</button>
                                            <button onClick={() => handleDeleteLoan(item.id)} className="btn btn-sm btn-outline btn-error">Supprimer</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center mt-6">
                        {pagination && <Pagination 
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={setCurrentPage}
                        />}
                    </div>
                </>
            )}
        </>
    );
};

export default LoansTable;
