import React, { useState, useEffect } from 'react';

const EditLoanModal = ({ loanItem, isOpen, onClose, onSave }) => {
    const [borrowerName, setBorrowerName] = useState('');
    const [loanDate, setLoanDate] = useState('');
    const [expectedReturnDate, setExpectedReturnDate] = useState('');
    const [actualReturnDate, setActualReturnDate] = useState('');
    const [status, setStatus] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (loanItem) {
            setBorrowerName(loanItem.borrower_name);
            setLoanDate(loanItem.loan_date ? new Date(loanItem.loan_date).toISOString().split('T')[0] : '');
            setExpectedReturnDate(loanItem.expected_return_date ? new Date(loanItem.expected_return_date).toISOString().split('T')[0] : '');
            setActualReturnDate(loanItem.actual_return_date ? new Date(loanItem.actual_return_date).toISOString().split('T')[0] : '');
            setStatus(loanItem.status);
            setNotes(loanItem.notes || '');
        }
    }, [loanItem]);

    if (!isOpen || !loanItem) {
        return null;
    }

    const handleSave = () => {
        onSave(loanItem.id, {
            borrower_name: borrowerName,
            loan_date: loanDate,
            expected_return_date: expectedReturnDate,
            actual_return_date: actualReturnDate,
            status,
            notes
        });
    };

    return (
        <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">Modifier le prêt pour: {loanItem.media_title}</h3>
                
                <div className="form-control w-full py-4">
                    <label className="label">
                        <span className="label-text">Nom de l'emprunteur</span>
                    </label>
                    <input 
                        type="text" 
                        placeholder="Nom de l'emprunteur" 
                        className="input input-bordered w-full"
                        value={borrowerName}
                        onChange={(e) => setBorrowerName(e.target.value)}
                    />
                </div>

                <div className="form-control w-full py-4">
                    <label className="label">
                        <span className="label-text">Date de prêt</span>
                    </label>
                    <input 
                        type="date" 
                        className="input input-bordered w-full"
                        value={loanDate}
                        onChange={(e) => setLoanDate(e.target.value)}
                    />
                </div>

                <div className="form-control w-full py-4">
                    <label className="label">
                        <span className="label-text">Date de retour prévue</span>
                    </label>
                    <input 
                        type="date" 
                        className="input input-bordered w-full"
                        value={expectedReturnDate}
                        onChange={(e) => setExpectedReturnDate(e.target.value)}
                    />
                </div>

                <div className="form-control w-full py-4">
                    <label className="label">
                        <span className="label-text">Date de retour réelle</span>
                    </label>
                    <input 
                        type="date" 
                        className="input input-bordered w-full"
                        value={actualReturnDate}
                        onChange={(e) => setActualReturnDate(e.target.value)}
                    />
                </div>

                <div className="form-control w-full py-4">
                    <label className="label">
                        <span className="label-text">Statut</span>
                    </label>
                    <select 
                        className="select select-bordered"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="active">Actif</option>
                        <option value="returned">Retourné</option>
                        <option value="overdue">En retard</option>
                    </select>
                </div>

                <div className="form-control w-full py-4">
                    <label className="label">
                        <span className="label-text">Notes</span>
                    </label>
                    <textarea 
                        placeholder="Notes" 
                        className="textarea textarea-bordered w-full"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
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

export default EditLoanModal;
