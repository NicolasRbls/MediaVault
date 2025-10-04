import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const LoanFormModal = ({ isOpen, onClose, onSave }) => {
    const { t } = useTranslation();
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

    return (
        <dialog id="loan_form_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box w-11/12 max-w-lg bg-neutral/70 backdrop-blur-xl border border-white/10">
                <h3 className="font-bold text-2xl mb-6">{t('loanForm.title')}</h3>
                {loading ? <div className="text-center"><span className="loading loading-spinner"></span></div> : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-control w-full mb-4">
                            <label className="label"><span className="label-text">{t('loanForm.itemToLend')}*</span></label>
                            <select name="media_id" value={formData.media_id} onChange={handleChange} className="select select-bordered w-full bg-base-200" required>
                                {ownedMedia.map(item => (
                                    <option key={item.id} value={item.id}>{item.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-control w-full mb-4">
                            <label className="label"><span className="label-text">{t('loanForm.lentTo')}*</span></label>
                            <input type="text" name="borrower_name" value={formData.borrower_name} onChange={handleChange} className="input input-bordered w-full bg-base-200" required />
                        </div>
                        <div className="form-control w-full mb-4">
                            <label className="label"><span className="label-text">{t('loanForm.loanDate')}*</span></label>
                            <input type="date" name="loan_date" value={formData.loan_date} onChange={handleChange} className="input input-bordered w-full bg-base-200" required />
                        </div>
                        <div className="form-control w-full mb-4">
                            <label className="label"><span className="label-text">{t('loanForm.returnDate')}</span></label>
                            <input type="date" name="expected_return_date" value={formData.expected_return_date} onChange={handleChange} className="input input-bordered w-full bg-base-200" />
                        </div>
                        <div className="form-control w-full mb-6">
                            <label className="label"><span className="label-text">{t('loanForm.notes')}</span></label>
                            <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" className="textarea textarea-bordered w-full bg-base-200"></textarea>
                        </div>
                        <div className="modal-action mt-6">
                            <button type="button" onClick={onClose} className="btn btn-ghost">{t('loanForm.cancel')}</button>
                            <button type="submit" className="btn btn-primary">{t('loanForm.save')}</button>
                        </div>
                    </form>
                )}
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
};

export default LoanFormModal;
