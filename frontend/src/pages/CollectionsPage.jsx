import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CollectionFormModal from '../components/collections/CollectionFormModal';
import { useToast } from '../context/ToastContext';

const CollectionsPage = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToast } = useToast();

    const fetchCollections = async () => {
        try {
            setLoading(true);
            const res = await api.get('/collections');
            setCollections(res.data);
        } catch (err) {
            setError('Could not fetch collections.');
            addToast('Could not fetch collections.', 'error');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCollections();
    }, []);

    const handleSaveCollection = async (formData) => {
        try {
            await api.post('/collections', formData);
            fetchCollections();
            setIsModalOpen(false);
            addToast('Collection created successfully!', 'success');
        } catch (err) {
            addToast('Failed to create collection.', 'error');
        }
    };

    if (loading) return <div className="text-center p-8">Loading collections...</div>;
    if (error) return <div className="text-center p-8 text-primary">{error}</div>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">My Collections</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">
                    Create New Collection
                </button>
            </div>

            <CollectionFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveCollection}
            />

            {collections.length === 0 ? (
                <div className="text-center bg-dark-alt p-12 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold">No collections yet!</h2>
                    <p className="text-gray-text mt-2">Click "Create New Collection" to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map(collection => (
                        <Link to={`/collections/${collection.id}`} key={collection.id} className="block bg-dark-alt p-6 rounded-lg hover:bg-gray-700 transition-colors shadow-md">
                            <h3 className="text-2xl font-bold text-primary truncate">{collection.name}</h3>
                            <p className="text-gray-text mt-2 truncate">{collection.description || 'No description.'}</p>
                            <div className="mt-4 pt-4 border-t border-gray-700 text-sm text-gray-text">
                                {collection.media_count} {collection.media_count === 1 ? 'item' : 'items'}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CollectionsPage;