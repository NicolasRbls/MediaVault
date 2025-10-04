import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useTranslation } from 'react-i18next';

const MediaFormModal = ({ isOpen, onClose, onSave, mediaItem }) => {
    const [formData, setFormData] = useState({
        title: '',
        type: 'book',
        author_creator: '',
        description: '',
        release_year: '',
        isbn_code: '',
        status: 'owned',
        acquisition_date: '',
    });
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [tags, setTags] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        if (mediaItem) {
            setFormData({
                title: mediaItem.title || '',
                type: mediaItem.type || 'book',
                author_creator: mediaItem.author_creator || '',
                description: mediaItem.description || '',
                release_year: mediaItem.release_year || '',
                isbn_code: mediaItem.isbn_code || '',
                status: mediaItem.status || 'owned',
                acquisition_date: mediaItem.acquisition_date ? new Date(mediaItem.acquisition_date).toISOString().split('T')[0] : '',
            });
            setCoverImageFile(null);
            api.get(`/media/${mediaItem.id}/tags`).then(res => {
                setTags(res.data.map(t => t.name).join(', '));
            });
        } else {
            setFormData({ title: '', type: 'book', author_creator: '', description: '', release_year: '', isbn_code: '', status: 'owned', acquisition_date: '' });
            setCoverImageFile(null);
            setTags('');
        }
    }, [mediaItem, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setCoverImageFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submissionData = new FormData();
        
        Object.keys(formData).forEach(key => {
            submissionData.append(key, formData[key]);
        });

        if (coverImageFile) {
            submissionData.append('cover_image', coverImageFile);
        }

        const tagNames = tags.split(',').map(t => t.trim()).filter(Boolean);
        onSave(submissionData, tagNames);
    };

    return (
        <dialog id="media_form_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box w-11/12 max-w-3xl bg-neutral/70 backdrop-blur-xl border border-white/10">
                <h3 className="font-bold text-2xl mb-6 text-white">{mediaItem ? t('edit_media') : t('add_new_media_modal_title')}</h3>
                
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text text-white/70">{t('title')}*</span></label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} className="input input-bordered bg-base-100/50" required />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text text-white/70">{t('type')}*</span></label>
                            <select name="type" value={formData.type} onChange={handleChange} className="select select-bordered bg-base-100/50">
                                <option value="book">{t('book')}</option>
                                <option value="movie">{t('movie')}</option>
                                <option value="series">{t('series')}</option>
                                <option value="game">{t('game')}</option>
                                <option value="music">{t('music')}</option>
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text text-white/70">{t('author_creator')}</span></label>
                            <input type="text" name="author_creator" value={formData.author_creator} onChange={handleChange} className="input input-bordered bg-base-100/50" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text text-white/70">{t('release_year')}</span></label>
                            <input type="number" name="release_year" value={formData.release_year} onChange={handleChange} className="input input-bordered bg-base-100/50" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text text-white/70">{t('isbn_code')}</span></label>
                            <input type="text" name="isbn_code" value={formData.isbn_code} onChange={handleChange} className="input input-bordered bg-base-100/50" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text text-white/70">{t('cover_image')}</span></label>
                            <input type="file" name="cover_image" onChange={handleFileChange} className="file-input file-input-bordered bg-base-100/50 w-full" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text text-white/70">{t('acquisition_date')}</span></label>
                            <input type="date" name="acquisition_date" value={formData.acquisition_date} onChange={handleChange} className="input input-bordered bg-base-100/50" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text text-white/70">{t('status')}</span></label>
                            <select name="status" value={formData.status} onChange={handleChange} className="select select-bordered bg-base-100/50">
                                <option value="owned">{t('owned')}</option>
                                <option value="wishlist">{t('wishlist_status')}</option>
                                <option value="borrowed">{t('borrowed')}</option>
                                <option value="lent">{t('lent')}</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-control mt-4">
                        <label className="label"><span className="label-text text-white/70">{t('description')}</span></label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="textarea textarea-bordered bg-base-100/50"></textarea>
                    </div>
                    <div className="form-control mt-4">
                        <label className="label"><span className="label-text text-white/70">{t('tags_comma_separated')}</span></label>
                        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="input input-bordered bg-base-100/50" />
                    </div>

                    <div className="modal-action mt-8">
                        <button type="button" onClick={onClose} className="btn btn-ghost">{t('cancel')}</button>
                        <button type="submit" className="btn btn-primary">{t('save')}</button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
};

export default MediaFormModal;
