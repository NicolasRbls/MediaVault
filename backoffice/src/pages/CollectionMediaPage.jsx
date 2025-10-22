import React from 'react';
import { useParams } from 'react-router-dom';
import CollectionMediaTable from '../components/collections/CollectionMediaTable';

const CollectionMediaPage = () => {
    const { collectionId } = useParams();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Médias de la Collection #{collectionId}</h1>
            <div className="p-6 bg-base-200 rounded-box shadow-lg">
                <CollectionMediaTable collectionId={collectionId} />
            </div>
        </div>
    );
};

export default CollectionMediaPage;
