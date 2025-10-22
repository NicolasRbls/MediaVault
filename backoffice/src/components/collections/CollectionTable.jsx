import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Pagination from '../common/Pagination';
import SearchInput from '../common/SearchInput';
import EditCollectionModal from './EditCollectionModal';
import { Link } from 'react-router-dom';

const CollectionTable = () => {
    const [collections, setCollections] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState(null);

    // Debounce search term
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timerId);
    }, [searchTerm]);

    const fetchCollections = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(`/admin/collections?page=${currentPage}&search=${debouncedSearchTerm}`);
            setCollections(res.data.data);
            setPagination(res.data.pagination);
        } catch (err) {
            setError('Failed to fetch collections.');
            toast.error('Impossible de charger les collections.');
        } finally {
            setLoading(false);
        }
    }, [currentPage, debouncedSearchTerm]);

    useEffect(() => {
        fetchCollections();
    }, [fetchCollections]);

    const openEditModal = (collectionItem) => {
        setSelectedCollection(collectionItem);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedCollection(null);
        setIsEditModalOpen(false);
    };

    const handleSaveCollection = async (collectionId, updatedData) => {
        const promise = api.put(`/admin/collections/${collectionId}`, updatedData);
        toast.promise(promise, {
            loading: 'Mise à jour de la collection...',
            success: () => {
                fetchCollections();
                closeEditModal();
                return 'Collection mise à jour avec succès !';
            },
            error: 'Échec de la mise à jour.',
        });
    };

    const handleDeleteCollection = async (collectionId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette collection ? Cette action est irréversible.')) {
            const promise = api.delete(`/admin/collections/${collectionId}`);
            toast.promise(promise, {
                loading: 'Suppression de la collection...',
                success: () => {
                    fetchCollections();
                    return 'Collection supprimée avec succès !';
                },
                error: 'Échec de la suppression.',
            });
        }
    };

    return (
        <>
            <EditCollectionModal 
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                onSave={handleSaveCollection}
                collectionItem={selectedCollection}
            />
            <div className="mb-4">
                <SearchInput 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher par nom..."
                />
            </div>

            {loading && collections.length === 0 ? (
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
                                    <th>Nom</th>
                                    <th>Description</th>
                                    <th>Propriétaire</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {collections.map(item => (
                                    <tr key={item.id}>
                                        <th>{item.id}</th>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td>{item.owner_username}</td>
                                        <td className="flex gap-2">
                                            <Link to={`/collections/${item.id}/media`} className="btn btn-sm btn-outline btn-primary">Voir Médias</Link>
                                            <button onClick={() => openEditModal(item)} className="btn btn-sm btn-outline btn-info">Modifier</button>
                                            <button onClick={() => handleDeleteCollection(item.id)} className="btn btn-sm btn-outline btn-error">Supprimer</button>
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

export default CollectionTable;
