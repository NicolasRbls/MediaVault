import React, { useState, useEffect } from 'react';

const EditMediaModal = ({ mediaItem, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        // Populate form when a media item is selected
        if (mediaItem) {
            setFormData({
                title: mediaItem.title || '',
                author_creator: mediaItem.author_creator || '',
                description: mediaItem.description || '',
                type: mediaItem.type || 'book',
                status: mediaItem.status || 'owned',
                release_year: mediaItem.release_year || '',
            });
        }
    }, [mediaItem]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(mediaItem.id, formData);
    };

    if (!isOpen || !mediaItem) {
        return null;
    }

    return (
        <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box w-11/12 max-w-2xl">
                <h3 className="font-bold text-lg">Modifier: {mediaItem.title}</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="form-control">
                        <label className="label"><span className="label-text">Titre</span></label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="input input-bordered" />
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">Auteur/Créateur</span></label>
                        <input type="text" name="author_creator" value={formData.author_creator} onChange={handleChange} className="input input-bordered" />
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">Description</span></label>
                        <textarea name="description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered" rows="3"></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Type</span></label>
                            <select name="type" value={formData.type} onChange={handleChange} className="select select-bordered">
                                <option value="book">Livre</option>
                                <option value="movie">Film</option>
                                <option value="series">Série</option>
                                <option value="game">Jeu</option>
                                <option value="music">Musique</option>
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Statut</span></label>
                            <select name="status" value={formData.status} onChange={handleChange} className="select select-bordered">
                                <option value="owned">Possédé</option>
                                <option value="wishlist">Liste de souhaits</option>
                                <option value="borrowed">Emprunté</option>
                                <option value="lent">Prêté</option>
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Année</span></label>
                            <input type="number" name="release_year" value={formData.release_year} onChange={handleChange} className="input input-bordered" />
                        </div>
                    </div>
                    <div className="modal-action mt-6">
                        <button type="button" onClick={onClose} className="btn btn-ghost">Annuler</button>
                        <button type="submit" className="btn btn-primary">Enregistrer</button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
};

export default EditMediaModal;
