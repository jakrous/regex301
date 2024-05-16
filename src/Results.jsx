import React from 'react';

function Results({ results }) {
    return (
        <div className="mt-4">
            <h2 className="text-xl font-bold">Results</h2>
            <pre className="bg-gray-200 p-4 rounded mt-2">{results ? JSON.stringify(results, null, 2) : "No matches found."}</pre>
        </div>
    );
}

export default Results;
