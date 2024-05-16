import { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [pyodide, setPyodide] = useState(null);
    const [regex, setRegex] = useState('');
    const [testString, setTestString] = useState('');
    const [results, setResults] = useState(null);
    const [engine, setEngine] = useState('python');
    const [flags, setFlags] = useState({
        i: { checked: false, description: 'IGNORECASE' },
        m: { checked: false, description: 'MULTILINE' },
        s: { checked: false, description: 'DOTALL' },
        a: { checked: false, description: 'ASCII' },
        l: { checked: false, description: 'LOCALE' },
        u: { checked: false, description: 'UNICODE' },
        x: { checked: false, description: 'VERBOSE' },
    });

    useEffect(() => {
        const loadPyodide = async () => {
            const pyodide = await window.loadPyodide();
            setPyodide(pyodide);
        };
        loadPyodide();
    }, []);

    const handleTest = async () => {
        try {
            let matches;
            if (engine === 'python') {
                matches = await testRegexPython(regex, testString);
            } else {
                matches = testRegexJava(regex, testString);
            }
            setResults(matches);
        } catch (e) {
            setResults('Invalid regular expression');
        }
    };

    const testRegexPython = async (regex, input, flags) => {
        try {
            const code = `
import re


def test(regex, input, flags=''):
    flag_dict = {
        'a': re.ASCII,
        'i': re.IGNORECASE,
        'l': re.LOCALE,
        'm': re.MULTILINE,
        's': re.DOTALL,
        'u': re.UNICODE,
        'x': re.VERBOSE,
    }

    combined_flags = 0
    for flag in flags:
        if flag in flag_dict:
            combined_flags |= flag_dict[flag]

    regex = re.compile(regex, combined_flags)
    return bool(regex.search(input))


test('''${regex}''', '''${input}''', flags='''${flags}''')
            `;

            await pyodide.loadPackagesFromImports(code);
            return await pyodide.runPythonAsync(code);
        } catch (e) {

        }
    }

    const testRegexJava = (pattern, testString) => {
        // Mock function to simulate Java regex matching
        try {
            const re = new RegExp(pattern);
            return testString.match(re);
        } catch (e) {
            return 'Invalid regular expression';
        }
    };

    const handleFlagChange = (e) => {
        const { name, checked } = e.target;
        setFlags(prevFlags => ({
            ...prevFlags,
            [name]: { ...prevFlags[name], checked },
        }));
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <h1 className="text-2xl font-bold mb-4">Regex Tester</h1>
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
                            <label key={flag} className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    name={flag}
                                    checked={flags[flag].checked}
                                    onChange={handleFlagChange}
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <span className="ml-2 text-gray-700">{flags[flag].description}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={handleTest}
                >
                    Test
                </button>
                <div className="mt-4">
                    <h2 className="text-xl font-bold">Results</h2>
                    <pre
                        className="bg-gray-200 p-4 rounded mt-2">{results ? JSON.stringify(results, null, 2) : "No matches found."}</pre>
                </div>
            </div>
        </div>
    );
}

export default App;