import React from 'react';

function FlagCheckbox({ name, checked, description, onChange }) {
    return (
        <label className="inline-flex items-center">
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-gray-700">{description}</span>
        </label>
    );
}

export default FlagCheckbox;
