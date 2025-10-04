import React from 'react';
import MediaTable from '../components/media/MediaTable';

const MediaPage = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Gestion des Médias</h1>
            <div className="p-6 bg-base-200 rounded-box shadow-lg">
                <MediaTable />
            </div>
        </div>
    );
};

export default MediaPage;
