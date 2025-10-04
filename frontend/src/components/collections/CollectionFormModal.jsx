import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const CollectionFormModal = ({ isOpen, onClose, onSave, collection }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        if (isOpen) {
            if (collection) {
                setFormData(collection);
            } else {
                setFormData({ name: '', description: '' });
            }
        }
    }, [collection, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <dialog id="collection_form_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">{collection ? t('collectionForm.editTitle') : t('collectionForm.createTitle')}</h3>
                
                <form onSubmit={handleSubmit} className="py-4">
                    <div className="form-control w-full mb-4">
                        <label className="label">
                            <span className="label-text">{t('collectionForm.name')}*</span>
                        </label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name}
                            onChange={handleChange}
                            className="input input-bordered w-full" 
                            required 
                        />
                    </div>
                    <div className="form-control w-full mb-6">
                        <label className="label">
                            <span className="label-text">{t('collectionForm.description')}</span>
                        </label>
                        <textarea 
                            name="description" 
                            value={formData.description}
                            onChange={handleChange}
                            rows="4" 
                            className="textarea textarea-bordered w-full"
                        ></textarea>
                    </div>
                    <div className="modal-action">
                        <button type="button" onClick={onClose} className="btn btn-ghost">{t('collectionForm.cancel')}</button>
                        <button type="submit" className="btn btn-primary">{t('collectionForm.save')}</button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
};

export default CollectionFormModal;