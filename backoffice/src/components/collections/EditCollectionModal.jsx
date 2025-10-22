import React, { useState, useEffect } from 'react';

const EditCollectionModal = ({ collectionItem, isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (collectionItem) {
            setName(collectionItem.name);
            setDescription(collectionItem.description || '');
        }
    }, [collectionItem]);

    if (!isOpen || !collectionItem) {
        return null;
    }

    const handleSave = () => {
        onSave(collectionItem.id, { name, description });
    };

    return (
        <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">Modifier la collection: {collectionItem.name}</h3>
                
                <div className="form-control w-full py-4">
                    <label className="label">
                        <span className="label-text">Nom de la collection</span>
                    </label>
                    <input 
                        type="text" 
                        placeholder="Nom" 
                        className="input input-bordered w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="form-control w-full py-4">
                    <label className="label">
                        <span className="label-text">Description</span>
                    </label>
                    <textarea 
                        placeholder="Description" 
                        className="textarea textarea-bordered w-full"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <div className="modal-action">
                    <button onClick={onClose} className="btn btn-ghost">Annuler</button>
                    <button onClick={handleSave} className="btn btn-primary">Enregistrer</button>
                </div>
            </div>
            {/* Closes the modal when clicking outside */}
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
};

export default EditCollectionModal;
