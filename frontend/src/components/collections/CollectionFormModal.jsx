import React, { useState, useEffect } from 'react';

const CollectionFormModal = ({ isOpen, onClose, onSave, collection }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        if (collection) {
            setFormData(collection);
        } else {
            setFormData({ name: '', description: '' });
        }
    }, [collection]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-dark-alt p-8 rounded-lg shadow-lg w-full max-w-lg text-light">
                <h2 className="text-2xl font-bold mb-6">{collection ? 'Edit Collection' : 'Create New Collection'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-text mb-2">Name*</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-dark border border-gray-700 rounded-md py-2 px-3" 
                            required 
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-text mb-2">Description</label>
                        <textarea 
                            name="description" 
                            value={formData.description}
                            onChange={handleChange}
                            rows="4" 
                            className="w-full bg-dark border border-gray-700 rounded-md py-2 px-3"
                        ></textarea>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
                        <button type="submit" className="bg-primary hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CollectionFormModal;