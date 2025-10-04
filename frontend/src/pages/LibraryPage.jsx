import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MediaCard from '../components/media/MediaCard';
import MediaFormModal from '../components/media/MediaFormModal';
import SkeletonCard from '../components/common/SkeletonCard';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const LibraryPage = () => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToast } = useToast();
    const { t } = useTranslation();

    const fetchMedia = async () => {
        try {
            setLoading(true);
            const res = await api.get('/media');
            setMedia(res.data);
        } catch (err) {
            setError('Could not fetch media.');
            addToast('Could not fetch media.', 'error');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const handleSaveMedia = async (formData, tagNames) => {
        try {
            const res = await api.post('/media', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const newMedia = res.data;
            if (tagNames.length > 0) {
                await api.post(`/media/${newMedia.id}/tags`, { tagNames });
            }
            fetchMedia();
            setIsModalOpen(false);
            addToast('Media added successfully!', 'success');
        } catch (err) {
            addToast('Failed to add media.', 'error');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">{t('library')}</h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary gap-2"
                >
                    <FiPlus />
                    {t('add_new_media')}
                </button>
            </div>

            <MediaFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveMedia}
            />

            {loading ? (
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
                >
                    {Array.from({ length: 10 }).map((_, index) => <SkeletonCard key={index} />)}
                </motion.div>
            ) : error ? (
                <div className="text-center p-8 text-error">{error}</div>
            ) : media.length === 0 ? (
                <div className="text-center bg-base-100/50 backdrop-blur-lg p-12 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold">{t('your_library_is_empty')}</h2>
                    <p className="text-base-content text-opacity-70 mt-2">{t('add_new_media_prompt')}</p>
                </div>
            ) : (
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
                >
                    {media.map(item => (
                        <motion.div key={item.id} variants={itemVariants}>
                            <MediaCard media={item} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default LibraryPage;
