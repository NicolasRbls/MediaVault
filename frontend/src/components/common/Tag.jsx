import React from 'react';

const Tag = ({ name, color }) => {
    // Generate a default color if none is provided
    const tagColor = color || '#718096'; // gray

    return (
        <span 
            className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full"
            style={{ backgroundColor: `${tagColor}20`, color: tagColor }}
        >
            {name}
        </span>
    );
};

export default Tag;
