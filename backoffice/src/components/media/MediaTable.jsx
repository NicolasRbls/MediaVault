import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Pagination from '../common/Pagination';
import SearchInput from '../common/SearchInput';
import EditMediaModal from './EditMediaModal';

const MediaTable = () => {
    const [media, setMedia] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);

    // Debounce search term
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timerId);
    }, [searchTerm]);

    const fetchMedia = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(`/admin/media?page=${currentPage}&search=${debouncedSearchTerm}`);
            setMedia(res.data.data);
            setPagination(res.data.pagination);
        } catch (err) {
            setError('Failed to fetch media.');
            toast.error('Impossible de charger les médias.');
        } finally {
            setLoading(false);
        }
    }, [currentPage, debouncedSearchTerm]);

    useEffect(() => {
        fetchMedia();
    }, [fetchMedia]);

    const openEditModal = (mediaItem) => {
        setSelectedMedia(mediaItem);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedMedia(null);
        setIsEditModalOpen(false);
    };

    const handleSaveMedia = async (mediaId, updatedData) => {
        const promise = api.put(`/admin/media/${mediaId}`, updatedData);
        toast.promise(promise, {
            loading: 'Mise à jour du média...',
            success: () => {
                fetchMedia();
                closeEditModal();
                return 'Média mis à jour avec succès !';
            },
            error: 'Échec de la mise à jour.',
        });
    };

    const handleDeleteMedia = async (mediaId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce média ? Cette action est irréversible.')) {
            const promise = api.delete(`/admin/media/${mediaId}`);
            toast.promise(promise, {
                loading: 'Suppression du média...',
                success: () => {
                    fetchMedia();
                    return 'Média supprimé avec succès !';
                },
                error: 'Échec de la suppression.',
            });
        }
    };

    return (
        <>
            <EditMediaModal 
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                onSave={handleSaveMedia}
                mediaItem={selectedMedia}
            />
            <div className="mb-4">
                <SearchInput 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher par titre ou créateur..."
                />
            </div>

            {loading && media.length === 0 ? (
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
                                    <th>Titre</th>
                                    <th>Type</th>
                                    <th>Statut</th>
                                    <th>Auteur/Créateur</th>
                                    <th>Propriétaire</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {media.map(item => (
                                    <tr key={item.id}>
                                        <th>{item.id}</th>
                                        <td>{item.title}</td>
                                        <td><span className="badge badge-neutral">{item.type}</span></td>
                                        <td><span className="badge badge-info badge-outline">{item.status}</span></td>
                                        <td>{item.author_creator}</td>
                                        <td>{item.owner_username}</td>
                                        <td className="flex gap-2">
                                            <button onClick={() => openEditModal(item)} className="btn btn-sm btn-outline btn-info">Modifier</button>
                                            <button onClick={() => handleDeleteMedia(item.id)} className="btn btn-sm btn-outline btn-error">Supprimer</button>
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

export default MediaTable;
