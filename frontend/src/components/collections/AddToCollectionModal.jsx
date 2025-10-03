import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AddToCollectionModal = ({ isOpen, onClose, onAdd, mediaId }) => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCollection, setSelectedCollection] = useState('');

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            // Fetch media with status 'owned'
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-dark-alt p-8 rounded-lg shadow-lg w-full max-w-md text-light">
                <h2 className="text-2xl font-bold mb-6">Add to Collection</h2>
                {loading ? (
                    <p className="text-gray-text">Loading collections...</p>
                ) : collections.length === 0 ? (
                    <p className="text-gray-text">You don't have any collections yet. Create one from the Collections page.</p>
                ) : (
                    <> 
                        <select 
                            value={selectedCollection}
                            onChange={(e) => setSelectedCollection(e.target.value)}
                            className="w-full bg-dark border border-gray-700 rounded-md py-2 px-3 mb-6 text-light"
                        >
                            {collections.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        <div className="flex justify-end space-x-4">
                            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
                            <button onClick={handleAdd} className="bg-primary hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">Add</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AddToCollectionModal;