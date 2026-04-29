import React from 'react';

const Input = ({ label, type = 'text', placeholder, value, onChange, name, error }) => {
    return (
        <div className="flex flex-col space-y-2 w-full">
            {label && <label className="text-xs font-bold text-apple-dark/60 ml-4 uppercase tracking-wider">{label}</label>}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`px-5 py-4 bg-apple-gray border-2 border-transparent rounded-apple text-apple-dark focus:bg-white focus:border-apple-blue outline-none transition-all duration-300 ${error ? 'border-red-500 bg-red-50' : ''}`}
            />
            {error && <span className="text-xs text-red-500 ml-4 font-medium italic">{error}</span>}
        </div>
    );
};

export default Input;