import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { ThemeContext } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const AddToCollectionModal = ({ isOpen, onClose, onAdd, mediaId }) => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCollection, setSelectedCollection] = useState('');
    const { theme } = useContext(ThemeContext);
    const { t } = useTranslation();

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            api.get('/collections')
                .then(res => {
                    setCollections(res.data);
                    if (res.data.length > 0) {
                        setSelectedCollection(res.data[0].id);
                    }
                })
                .catch(err => console.error("Failed to fetch collections", err))
                .finally(() => setLoading(false));
        }
    }, [isOpen]);

    const handleAdd = () => {
        if (selectedCollection) {
            onAdd(selectedCollection, mediaId);
        }
    };

    return (
        <dialog id="add_to_collection_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box bg-neutral/70 backdrop-blur-xl border border-white/10">
                <h3 className="font-bold text-2xl mb-6">{t('add_to_collection_modal_title')}</h3>
                {loading ? (
                    <div className="text-center"><span className="loading loading-spinner"></span></div>
                ) : collections.length === 0 ? (
                    <p className="text-base-content/70">{t('no_collections_yet_modal')}</p>
                ) : (
                    <div className="form-control w-full">
                        <label className="label"><span className="label-text">{t('select_a_collection')}</span></label>
                        <select 
                            value={selectedCollection}
                            onChange={(e) => setSelectedCollection(e.target.value)}
                            className={`select select-bordered w-full ${theme === 'light' ? 'bg-gray-600' : 'bg-base-200'}`}
                        >
                            {collections.map(c => (
                                <option 
                                    key={c.id} 
                                    value={c.id}
                                >
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="modal-action mt-6">
                    <button type="button" onClick={onClose} className="btn btn-ghost">{t('cancel')}</button>
                    <button onClick={handleAdd} disabled={loading || collections.length === 0} className="btn btn-primary">{t('add')}</button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
};

export default AddToCollectionModal;