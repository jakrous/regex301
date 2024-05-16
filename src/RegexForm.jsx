import React from 'react';
import FlagCheckbox from './FlagCheckbox';

function RegexForm({ engine, setEngine, regex, setRegex, testString, setTestString, flags, handleFlagChange, handleTest }) {
    return (
        <div className="w-full max-w-lg bg-white p-6 rounded shadow-md">
            <div className="mb-4">
                <label className="block text-gray-700 font-medium">Regex Engine</label>
                <select
                    className="w-full px-3 py-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={engine}
                    onChange={(e) => setEngine(e.target.value)}
                >
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-medium">Regular Expression</label>
                <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={regex}
                    onChange={(e) => setRegex(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-medium">Test String</label>
                <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={testString}
                    onChange={(e) => setTestString(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-medium">Flags</label>
                <div className="flex flex-col gap-2 mt-2">
                    {Object.keys(flags).map(flag => (
                        <FlagCheckbox
                            key={flag}
                            name={flag}
                            checked={flags[flag].checked}
                            description={flags[flag].description}
                            onChange={handleFlagChange}
                        />
                    ))}
                </div>
            </div>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleTest}
            >
                Test
            </button>
        </div>
    );
}

export default RegexForm;
