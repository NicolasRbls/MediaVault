import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="card bg-neutral/50 shadow-xl border border-white/10 skeleton-pulse">
            <figure className="bg-neutral h-72"></figure>
            <div className="card-body p-4">
                <div className="h-6 w-3/4 bg-neutral rounded"></div>
                <div className="h-4 w-1/2 bg-neutral rounded mt-2"></div>
                <div className="card-actions justify-end mt-4">
                    <div className="h-6 w-16 bg-neutral rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;