import React from 'react';
import CollectionTable from '../components/collections/CollectionTable';

const CollectionsPage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Gestion des Collections</h1>
            <div className="p-6 bg-base-200 rounded-box shadow-lg">
                <CollectionTable />
            </div>
        </div>
    );
};

export default CollectionsPage;
