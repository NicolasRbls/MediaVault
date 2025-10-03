import React from 'react';
import Tag from './Tag';

const TagList = ({ tags }) => {
    if (!tags || tags.length === 0) {
        return <p className="text-gray-500 italic">No tags yet.</p>;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
                <Tag key={tag.id} name={tag.name} color={tag.color} />
            ))}
        </div>
    );
};

export default TagList;
