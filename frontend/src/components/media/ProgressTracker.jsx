import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const ProgressTracker = ({ mediaId, mediaType }) => {
    const [progress, setProgress] = useState({ current: '', total: '' });
    const { addToast } = useToast();

    const isTrackable = mediaType === 'book' || mediaType === 'series';
    const currentLabel = mediaType === 'book' ? 'Current Page' : 'Current Episode';
    const totalLabel = mediaType === 'book' ? 'Total Pages' : 'Total Episodes';

    useEffect(() => {
        if (isTrackable) {
            api.get(`/media/${mediaId}/progress`).then(res => {
                if (res.data) {
                    setProgress({
                        current: res.data.current_page || res.data.current_episode || '',
                        total: res.data.total_pages || res.data.total_episodes || ''
                    });
                }
            });
        }
    }, [mediaId, isTrackable]);

    const handleSaveProgress = () => {
        const payload = {
            current_page: mediaType === 'book' ? progress.current : null,
            total_pages: mediaType === 'book' ? progress.total : null,
            current_episode: mediaType === 'series' ? progress.current : null,
            total_episodes: mediaType === 'series' ? progress.total : null,
        };

        api.post(`/media/${mediaId}/progress`, payload)
            .then(() => addToast('Progress saved!', 'success'))
            .catch(() => addToast('Failed to save progress.', 'error'));
    };

    const percentage = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

    if (!isTrackable) {
        return null;
    }

    return (
        <div className="bg-base-200/30 backdrop-blur-lg p-6 rounded-lg border border-base-content/10 h-full">
            <h3 className="text-2xl font-bold mb-4 text-base-content">Track Your Progress</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="form-control">
                    <label className="label"><span className="label-text">{currentLabel}</span></label>
                    <input 
                        type="number"
                        value={progress.current}
                        onChange={e => setProgress(p => ({ ...p, current: e.target.value }))}
                        className="input input-bordered w-full bg-base-200/50"
                    />
                </div>
                <div className="form-control">
                    <label className="label"><span className="label-text">{totalLabel}</span></label>
                    <input 
                        type="number"
                        value={progress.total}
                        onChange={e => setProgress(p => ({ ...p, total: e.target.value }))}
                        className="input input-bordered w-full bg-base-200/50"
                    />
                </div>
            </div>
            <progress className="progress progress-primary w-full mb-4" value={percentage} max="100"></progress>
            <div className="text-right">
                <button onClick={handleSaveProgress} className="btn btn-primary">Save Progress</button>
            </div>
        </div>
    );
};

export default ProgressTracker;