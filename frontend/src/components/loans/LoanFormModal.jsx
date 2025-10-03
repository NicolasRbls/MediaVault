import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const LoanFormModal = ({ isOpen, onClose, onSave }) => {
    const [ownedMedia, setOwnedMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        media_id: '',
        borrower_name: '',
        loan_date: new Date().toISOString().split('T')[0],
        expected_return_date: '',
        notes: ''
    });

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            // Fetch media with status 'owned'
            api.get('/media?status=owned')
                .then(res => {
                    setOwnedMedia(res.data);
                    if (res.data.length > 0) {
                        setFormData(prev => ({ ...prev, media_id: res.data[0].id }));
                    }
                })
                .catch(err => console.error("Failed to fetch owned media", err))
                .finally(() => setLoading(false));
        }
    }, [isOpen]);

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
                <h2 className="text-2xl font-bold mb-6">Lend an Item</h2>
                {loading ? <p className="text-gray-text">Loading your media...</p> : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-text mb-2">Item to Lend*</label>
                            <select name="media_id" value={formData.media_id} onChange={handleChange} className="w-full bg-dark border border-gray-700 rounded-md py-2 px-3 text-light" required>
                                {ownedMedia.map(item => (
                                    <option key={item.id} value={item.id}>{item.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-text mb-2">Lent To (Name)*</label>
                            <input type="text" name="borrower_name" value={formData.borrower_name} onChange={handleChange} className="w-full bg-dark border border-gray-700 rounded-md py-2 px-3 text-light" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-text mb-2">Loan Date*</label>
                            <input type="date" name="loan_date" value={formData.loan_date} onChange={handleChange} className="w-full bg-dark border border-gray-700 rounded-md py-2 px-3 text-light" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-text mb-2">Expected Return Date</label>
                            <input type="date" name="expected_return_date" value={formData.expected_return_date} onChange={handleChange} className="w-full bg-dark border border-gray-700 rounded-md py-2 px-3 text-light" />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-text mb-2">Notes</label>
                            <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" className="w-full bg-dark border border-gray-700 rounded-md py-2 px-3 text-light"></textarea>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md">Cancel</button>
                            <button type="submit" className="bg-primary hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">Save Loan</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoanFormModal;
