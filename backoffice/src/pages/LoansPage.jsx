import React from 'react';
import LoansTable from '../components/loans/LoansTable';

const LoansPage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Gestion des Prêts</h1>
            <div className="p-6 bg-base-200 rounded-box shadow-lg">
                <LoansTable />
            </div>
        </div>
    );
};

export default LoansPage;
