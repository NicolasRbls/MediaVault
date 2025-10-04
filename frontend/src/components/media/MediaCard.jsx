import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:5000';

const MediaCard = ({ media }) => {
    const { id, title, author_creator, cover_image, type } = media;
    const cardRef = useRef(null);

    const placeholderImage = `https://via.placeholder.com/300x450/0D0D1A/8A2BE2?text=${encodeURIComponent(title)}`;
    const imageUrl = cover_image ? `${API_URL}${cover_image}` : placeholderImage;

    const handleMouseMove = (e) => {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardRef.current.style.setProperty('--x', `${x}px`);
        cardRef.current.style.setProperty('--y', `${y}px`);
    };

    return (
        <motion.div layoutId={`card-container-${id}`}>
            <Link 
                to={`/media/${id}`}
                ref={cardRef}
                onMouseMove={handleMouseMove}
                className="card-aurora card bg-neutral/50 shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out border border-white/10"
            >
                <figure>
                    <motion.img 
                        layoutId={`card-image-${id}`}
                        src={imageUrl} 
                        alt={`Cover for ${title}`}
                        className="w-full h-72 object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
                    />
                </figure>
                <div className="card-body p-4">
                    <h2 className="card-title text-lg truncate text-base-content" title={title}>
                        {title}
                    </h2>
                    <p className="text-sm text-base-content/60 truncate" title={author_creator}>{author_creator}</p>
                    <div className="card-actions justify-end">
                        <div className="badge badge-secondary badge-outline">{type}</div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default MediaCard;
