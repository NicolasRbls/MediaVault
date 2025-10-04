import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import EditUserModal from './EditUserModal';
import { useAdminAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Pagination from '../common/Pagination';
import SearchInput from '../common/SearchInput';

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const { admin } = useAdminAuth();

    // Debounce search term
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1); // Reset to first page on new search
        }, 500);
        return () => clearTimeout(timerId);
    }, [searchTerm]);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(`/admin/users?page=${currentPage}&search=${debouncedSearchTerm}`);
            setUsers(res.data.data);
            setPagination(res.data.pagination);
        } catch (err) {
            setError('Failed to fetch users.');
            toast.error('Impossible de charger les utilisateurs.');
        } finally {
            setLoading(false);
        }
    }, [currentPage, debouncedSearchTerm]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const openEditModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };

    const handleSaveRole = async (userId, newRole) => {
        const promise = api.put(`/admin/users/${userId}`, { role: newRole });
        toast.promise(promise, {
            loading: 'Mise à jour du rôle...',
            success: () => {
                fetchUsers();
                closeEditModal();
                return 'Rôle mis à jour avec succès !';
            },
            error: 'Échec de la mise à jour.',
        });
    };

    const handleDeleteUser = async (userId) => {
        if (admin && admin.id === userId) {
            toast.error("Vous ne pouvez pas vous supprimer vous-même.");
            return;
        }
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            const promise = api.delete(`/admin/users/${userId}`);
            toast.promise(promise, {
                loading: 'Suppression de l\'utilisateur...',
                success: () => {
                    fetchUsers();
                    return 'Utilisateur supprimé avec succès !';
                },
                error: 'Échec de la suppression.',
            });
        }
    };

    return (
        <>
            <EditUserModal 
                isOpen={isModalOpen}
                onClose={closeEditModal}
                onSave={handleSaveRole}
                user={selectedUser}
            />
            <div className="mb-4">
                <SearchInput 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher par nom ou email..."
                />
            </div>
            
            {loading && users.length === 0 ? (
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
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Membre depuis</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <th>{user.id}</th>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-ghost'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td className="flex gap-2">
                                            <button onClick={() => openEditModal(user)} className="btn btn-sm btn-outline btn-info">Modifier</button>
                                            <button onClick={() => handleDeleteUser(user.id)} className="btn btn-sm btn-outline btn-error">Supprimer</button>
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

export default UsersTable;
