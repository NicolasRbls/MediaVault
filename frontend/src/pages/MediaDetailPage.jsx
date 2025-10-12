import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import MediaFormModal from '../components/media/MediaFormModal';
import TagList from '../components/common/TagList';
import AddToCollectionModal from '../components/collections/AddToCollectionModal';
import RatingSection from '../components/media/RatingSection';
import ProgressTracker from '../components/media/ProgressTracker';
import { useToast } from '../context/ToastContext';
import { FiEdit, FiTrash2, FiPlusSquare } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/AuthContext';

const MediaDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const [media, setMedia] = useState(null);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddToCollectionModalOpen, setIsAddToCollectionModalOpen] = useState(false);

    const fetchMediaAndTags = async () => {
        try {
            setLoading(true);
            const [mediaRes, tagsRes] = await Promise.all([
                api.get(`/media/${id}`),
                api.get(`/media/${id}/tags`)
            ]);
            setMedia(mediaRes.data);
            setTags(tagsRes.data);
        } catch (err) {
            setError('Could not fetch media details.');
            addToast('Could not fetch media details.', 'error');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (user && id) {
            fetchMediaAndTags();
        }
    }, [id, user]);

    const handleUpdate = async (formData, tagNames) => {
        try {
            await api.put(`/media/${id}`, formData);
            if (tagNames) {
                await api.post(`/media/${id}/tags`, { tagNames });
            }
            fetchMediaAndTags();
            setIsEditModalOpen(false);
            addToast('Media updated successfully!', 'success');
        } catch (err) {
            addToast('Failed to update media.', 'error');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.delete(`/media/${id}`);
                addToast('Media deleted successfully!', 'success');
                navigate('/library');
            } catch (err) {
                addToast('Failed to delete media.', 'error');
            }
        }
    };

    const handleAddToCollection = async (collectionId, mediaId) => {
        try {
            await api.post(`/collections/${collectionId}/media`, { media_id: mediaId });
            setIsAddToCollectionModalOpen(false);
            addToast('Added to collection!', 'success');
        } catch (err) {
            addToast(err.response?.data?.message || 'Failed to add to collection.', 'error');
        }
    };

    if (loading) return <div className="text-center p-8"><span className="loading loading-spinner loading-lg"></span></div>;
    if (error) return <div className="text-center p-8 text-error">{error}</div>;
    if (!media) return null;

    const placeholderImage = `https://via.placeholder.com/400x600/0D0D1A/8A2BE2?text=${encodeURIComponent(media.title)}`;
    const imageUrl = media.cover_image ? media.cover_image : placeholderImage;

    return (
        <div className="p-4 text-base-content">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Cover Image and Actions */}
                <motion.div layoutId={`card-container-${id}`} className="md:col-span-1 flex flex-col items-center">
                    <motion.img 
                        layoutId={`card-image-${id}`}
                        src={imageUrl} 
                        alt={`Cover for ${media.title}`}
                        className="w-full max-w-sm rounded-lg shadow-2xl border-2 border-white/10 object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
                    />
                    <div className="mt-6 flex flex-wrap justify-center gap-4">
                        <button onClick={() => setIsEditModalOpen(true)} className="btn btn-primary btn-outline gap-2"><FiEdit /> {t('edit')}</button>
                        <button onClick={() => setIsAddToCollectionModalOpen(true)} className="btn btn-secondary btn-outline gap-2"><FiPlusSquare /> {t('add_to_collection')}</button>
                        <button onClick={handleDelete} className="btn btn-error btn-outline gap-2"><FiTrash2 /> {t('delete')}</button>
                    </div>
                </motion.div>

                {/* Right Column: Details */}
                <div className="md:col-span-2">
                    <h1 className="text-5xl font-extrabold mb-2" style={{ textShadow: '0 0 10px var(--tw-shadow-color, #8A2BE2)' }}>{media.title}</h1>
                    <p className="text-2xl text-base-content/70 mb-4">{media.author_creator}</p>
                    
                    <div className="flex items-center flex-wrap gap-4 mb-6">
                        <div className="badge badge-primary badge-lg capitalize">{t(media.type)}</div>
                        <div className="badge badge-secondary badge-lg capitalize">{t(media.status)}</div>
                        {media.release_year && <div className="badge badge-accent badge-lg">{media.release_year}</div>}
                    </div>

                    <div className="p-6 bg-neutral/50 backdrop-blur-lg rounded-lg border border-white/10 mb-6">
                        <h3 className="text-xl font-bold mb-2">{t('description')}</h3>
                        <p className="text-base-content/80 leading-relaxed">{media.description || t('no_description_available')}</p>
                    </div>

                    <div className="p-6 bg-neutral/50 backdrop-blur-lg rounded-lg border border-white/10 mb-6">
                        <h3 className="text-xl font-bold mb-2">{t('tags')}</h3>
                        <TagList tags={tags} />
                    </div>
                </div>
            </div>

            {/* Bottom Section: Progress and Rating */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-neutral/50 backdrop-blur-lg rounded-lg border border-white/10">
                    <ProgressTracker mediaId={media.id} mediaType={media.type} />
                </div>
                <div className="p-6 bg-neutral/50 backdrop-blur-lg rounded-lg border border-white/10">
                    <RatingSection mediaId={media.id} />
                </div>
            </div>

            {/* Modals */}
            <MediaFormModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleUpdate} mediaItem={media} />
            <AddToCollectionModal isOpen={isAddToCollectionModalOpen} onClose={() => setIsAddToCollectionModalOpen(false)} onAdd={handleAddToCollection} mediaId={media.id} />
        </div>
    );
};

export default MediaDetailPage;