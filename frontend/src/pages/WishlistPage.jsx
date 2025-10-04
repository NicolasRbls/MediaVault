import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import MediaCard from '../components/media/MediaCard';
import SkeletonCard from '../components/common/SkeletonCard';
import { useToast } from '../context/ToastContext';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const res = await api.get('/media?status=wishlist');
            setWishlist(res.data);
        } catch (err) {
            addToast('Could not fetch wishlist.', 'error');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (user) {
            fetchWishlist();
        }
    }, [user]);

    const moveToOwned = async (mediaItem) => {
        if (window.confirm(`Move "${mediaItem.title}" to your library as 'Owned'?`)) {
            try {
                await api.put(`/media/${mediaItem.id}`, { ...mediaItem, status: 'owned' });
                addToast('Item moved to library!', 'success');
                fetchWishlist(); // Refresh the list
            } catch (err) {
                addToast('Failed to move item.', 'error');
            }
        }
    };

    const renderSkeletons = () => (
        <motion.div 
            key="skeletons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
            {Array.from({ length: 5 }).map((_, index) => <SkeletonCard key={index} />)}
        </motion.div>
    );

    return (
        <div className="p-4">
            <h1 className="text-4xl font-bold mb-8">{t('my_wishlist')}</h1>

            <AnimatePresence mode="wait">
                {loading ? (
                    renderSkeletons()
                ) : wishlist.length === 0 ? (
                    <motion.div 
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center bg-dark-alt p-12 rounded-lg shadow-md"
                    >
                        <h2 className="text-2xl font-bold">{t('wishlist_is_empty')}</h2>
                        <p className="text-gray-text mt-2">{t('add_to_wishlist_prompt')}</p>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="wishlist-grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                    >
                        {wishlist.map(item => (
                            <div key={item.id} className="relative group">
                                <MediaCard media={item} />
                                <button 
                                    onClick={() => moveToOwned(item)}
                                    className="absolute top-2 right-2 bg-primary bg-opacity-70 text-light rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                                    title="Move to Owned"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3.125L5 18V4z" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WishlistPage;