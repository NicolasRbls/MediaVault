import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const MediaFormModal = ({ isOpen, onClose, onSave, mediaItem }) => {
    const [formData, setFormData] = useState({
        title: '',
        type: 'book',
        author_creator: '',
        description: '',
        cover_image: '',
        release_year: '',
        isbn_code: '',
        status: 'owned',
        acquisition_date: '',
    });
    const [tags, setTags] = useState('');

    useEffect(() => {
        if (mediaItem) {
            setFormData({
                title: mediaItem.title || '',
                type: mediaItem.type || 'book',
                author_creator: mediaItem.author_creator || '',
                description: mediaItem.description || '',
                cover_image: mediaItem.cover_image || '',
                release_year: mediaItem.release_year || '',
                isbn_code: mediaItem.isbn_code || '',
                status: mediaItem.status || 'owned',
                acquisition_date: mediaItem.acquisition_date ? new Date(mediaItem.acquisition_date).toISOString().split('T')[0] : '',
            });
            api.get(`/media/${mediaItem.id}/tags`).then(res => {
                setTags(res.data.map(t => t.name).join(', '));
            });
        } else {
            setFormData({ title: '', type: 'book', author_creator: '', description: '', cover_image: '', release_year: '', isbn_code: '', status: 'owned', acquisition_date: '' });
            setTags('');
        }
    }, [mediaItem, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const tagNames = tags.split(',').map(t => t.trim()).filter(Boolean);
        onSave(formData, tagNames);
    };

    return (
        <dialog id="media_form_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box w-11/12 max-w-3xl bg-neutral/70 backdrop-blur-xl border border-white/10">
                <h3 className="font-bold text-2xl mb-6 text-white">{mediaItem ? 'Edit Media' : 'Add New Media'}</h3>
                
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text text-white/70">Title*</span></label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} className="input input-bordered bg-base-100/50" required />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text text-white/70">Type*</span></label>
                            <select name="type" value={formData.type} onChange={handleChange} className="select select-bordered bg-base-100/50">
                                <option value="book">Book</option>
                                <option value="movie">Movie</option>
                                <option value="series">Series</option>
                                <option value="game">Game</option>
                                <option value="music">Music</option>
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text text-white/70">Author / Creator</span></label>
                            <input type="text" name="author_creator" value={formData.author_creator} onChange={handleChange} className="input input-bordered bg-base-100/50" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text text-white/70">Release Year</span></label>
                            <input type="number" name="release_year" value={formData.release_year} onChange={handleChange} className="input input-bordered bg-base-100/50" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text text-white/70">ISBN Code</span></label>
                            <input type="text" name="isbn_code" value={formData.isbn_code} onChange={handleChange} className="input input-bordered bg-base-100/50" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text text-white/70">Cover Image URL</span></label>
                            <input type="text" name="cover_image" value={formData.cover_image} onChange={handleChange} className="input input-bordered bg-base-100/50" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text text-white/70">Acquisition Date</span></label>
                            <input type="date" name="acquisition_date" value={formData.acquisition_date} onChange={handleChange} className="input input-bordered bg-base-100/50" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text text-white/70">Status</span></label>
                            <select name="status" value={formData.status} onChange={handleChange} className="select select-bordered bg-base-100/50">
                                <option value="owned">Owned</option>
                                <option value="wishlist">Wishlist</option>
                                <option value="borrowed">Borrowed</option>
                                <option value="lent">Lent</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-control mt-4">
                        <label className="label"><span className="label-text text-white/70">Description</span></label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="textarea textarea-bordered bg-base-100/50"></textarea>
                    </div>
                    <div className="form-control mt-4">
                        <label className="label"><span className="label-text text-white/70">Tags (comma-separated)</span></label>
                        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="input input-bordered bg-base-100/50" />
                    </div>

                    <div className="modal-action mt-8">
                        <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
                        <button type="submit" className="btn btn-primary">Save</button>
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
