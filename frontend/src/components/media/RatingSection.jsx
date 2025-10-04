import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import StarRating from '../common/StarRating';
import { useTranslation } from 'react-i18next';

const RatingSection = ({ mediaId }) => {
    const [rating, setRating] = useState(null);
    const [review, setReview] = useState('');
    const [finishedDate, setFinishedDate] = useState('');
    const { addToast } = useToast();
    const { t } = useTranslation();

    useEffect(() => {
        api.get(`/media/${mediaId}/ratings`)
            .then(res => {
                if (res.data) {
                    setRating(res.data.rating);
                    setReview(res.data.review || '');
                    setFinishedDate(res.data.finished_date ? new Date(res.data.finished_date).toISOString().split('T')[0] : '');
                }
            })
            .catch(err => console.error("Failed to fetch rating", err));
    }, [mediaId]);

    const handleSaveRating = () => {
        if (!rating) {
            addToast('Please select a rating first.', 'error');
            return;
        }
        const payload = { rating, review, finished_date: finishedDate };
        api.post(`/media/${mediaId}/ratings`, payload)
            .then(() => {
                addToast('Your review has been saved!', 'success');
            })
            .catch(() => {
                addToast('Failed to save your review.', 'error');
            });
    };

    const handleDeleteRating = () => {
        if (window.confirm('Are you sure you want to delete your review?')) {
            api.delete(`/media/${mediaId}/ratings`)
                .then(() => {
                    setRating(null);
                    setReview('');
                    setFinishedDate('');
                    addToast('Your review has been deleted.', 'success');
                })
                .catch(() => {
                    addToast('Failed to delete your review.', 'error');
                });
        }
    };

    return (
        <div className="bg-base-200/30 backdrop-blur-lg p-6 rounded-lg border border-base-content/10 h-full">
            <h3 className="text-2xl font-bold mb-4 text-base-content">{t('your_review')}</h3>
            <div className="mb-4">
                <p className="label-text mb-2">{t('your_rating')}</p>
                <StarRating rating={rating} onRatingChange={setRating} />
            </div>
            <div className="form-control mb-4">
                <label className="label"><span className="label-text">{t('review')}</span></label>
                <textarea 
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows="4"
                    className="textarea textarea-bordered w-full bg-base-200/50"
                    placeholder={t('what_did_you_think')}
                ></textarea>
            </div>
            <div className="form-control mb-4">
                <label className="label"><span className="label-text">{t('date_finished')}</span></label>
                <input 
                    type="date" 
                    value={finishedDate}
                    onChange={(e) => setFinishedDate(e.target.value)}
                    className="input input-bordered w-full bg-base-200/50"
                />
            </div>
            <div className="flex items-center justify-between">
                <button onClick={handleSaveRating} className="btn btn-primary">{t('save_review')}</button>
                {rating && (
                    <button onClick={handleDeleteRating} className="btn btn-ghost btn-sm text-error">{t('delete_review')}</button>
                )}
            </div>
        </div>
    );
};

export default RatingSection;