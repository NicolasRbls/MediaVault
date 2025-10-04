import React from 'react';
import UsersTable from '../components/users/UsersTable';

const UsersPage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Gestion des Utilisateurs</h1>
            <div className="p-6 bg-base-200 rounded-box shadow-lg">
                <UsersTable />
            </div>
        </div>
    );
};

export default UsersPage;
