import React from 'react';

const SearchInput = ({ value, onChange, placeholder }) => {
    return (
        <div className="form-control">
            <div className="relative">
                <input 
                    type="text"
                    placeholder={placeholder || 'Rechercher…'}
                    className="input input-bordered w-full pr-10"
                    value={value}
                    onChange={onChange}
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </span>
            </div>
        </div>
    );
};

export default SearchInput;
