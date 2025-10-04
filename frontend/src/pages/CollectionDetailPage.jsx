import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import MediaCard from '../components/media/MediaCard';
import SkeletonCard from '../components/common/SkeletonCard';
import { useToast } from '../context/ToastContext';
import { useTranslation } from 'react-i18next';

const CollectionDetailPage = () => {
    const { id } = useParams();
    const { addToast } = useToast();
    const { t } = useTranslation();
    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCollection = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/collections/${id}`);
            setCollection(res.data);
        } catch (err) {
            setError('Could not fetch collection details.');
            addToast('Could not fetch collection details.', 'error');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCollection();
    }, [id]);

    const handleRemoveItem = async (mediaId) => {
        if (window.confirm('Are you sure you want to remove this item from the collection?')) {
            try {
                await api.delete(`/collections/${id}/media/${mediaId}`);
                addToast('Item removed from collection!', 'success');
                fetchCollection(); // Refresh the list
            } catch (err) {
                addToast('Failed to remove item from collection.', 'error');
            }
        }
    };

    const renderSkeletons = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
    );

    if (loading) {
        return (
            <div className="p-4">
                <div className="mb-8">
                    <div className="h-12 bg-dark-alt rounded-md w-1/2 mb-4"></div>
                    <div className="h-6 bg-dark-alt rounded-md w-3/4"></div>
                </div>
                {renderSkeletons()}
            </div>
        );
    }

    if (error) return <div className="text-center p-8 text-primary">{error}</div>;
    if (!collection) return null;

    return (
        <div className="p-4">
            <div className="mb-8">
                <h1 className="text-5xl font-extrabold text-primary">{collection.name}</h1>
                <p className="text-xl text-gray-text mt-2">{collection.description}</p>
            </div>

            {collection.items.length === 0 ? (
                <div className="text-center bg-dark-alt p-12 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold">{t('collection_is_empty')}</h2>
                    <p className="text-gray-text mt-2">{t('add_items_from_library')}</p>
                    <Link to="/library" className="mt-4 inline-block bg-primary hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">{t('go_to_library')}</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {collection.items.map(item => (
                        <div key={item.id} className="relative group">
                            <MediaCard media={item} />
                            <button 
                                onClick={() => handleRemoveItem(item.id)}
                                className="absolute top-2 right-2 bg-dark-alt bg-opacity-70 text-light rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary"
                                title="Remove from collection"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CollectionDetailPage;
