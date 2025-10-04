import React, { useState, useEffect } from 'react';

const EditUserModal = ({ user, isOpen, onClose, onSave }) => {
    const [role, setRole] = useState('user');

    useEffect(() => {
        if (user) {
            setRole(user.role);
        }
    }, [user]);

    if (!isOpen || !user) {
        return null;
    }

    const handleSave = () => {
        onSave(user.id, role);
    };

    return (
        <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">Modifier le rôle de {user.username}</h3>
                
                <div className="form-control w-full py-4">
                    <label className="label">
                        <span className="label-text">Rôle</span>
                    </label>
                    <select 
                        className="select select-bordered"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="user">Utilisateur</option>
                        <option value="admin">Administrateur</option>
                    </select>
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

export default EditUserModal;