import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CollectionFormModal from '../components/collections/CollectionFormModal';
import { useToast } from '../context/ToastContext';
import { FiPlus } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const CollectionsPage = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToast } = useToast();
    const { t } = useTranslation();

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

    if (loading) return <div className="text-center p-8"><span className="loading loading-spinner loading-lg"></span></div>;
    if (error) return <div className="text-center p-8 text-error">{error}</div>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">{t('my_collections')}</h1>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary gap-2">
                    <FiPlus />
                    {t('create_new_collection')}
                </button>
            </div>

            <CollectionFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveCollection}
            />

            {collections.length === 0 ? (
                <div className="text-center bg-base-100/50 backdrop-blur-lg p-12 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold">{t('no_collections_yet')}</h2>
                    <p className="text-base-content text-opacity-70 mt-2">{t('create_new_collection_prompt')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map(collection => (
                        <Link to={`/collections/${collection.id}`} key={collection.id} className="block bg-base-200 p-6 rounded-lg hover:bg-base-300 transition-colors shadow-md border border-white/10">
                            <h3 className="text-2xl font-bold text-primary truncate">{collection.name}</h3>
                            <p className="text-base-content/70 mt-2 truncate">{collection.description || 'No description.'}</p>
                            <div className="mt-4 pt-4 border-t border-base-content/20 text-sm text-base-content/70">
                                {t('item_count', { count: collection.media_count || 0 })}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CollectionsPage;