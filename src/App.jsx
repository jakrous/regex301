import React, { useState, useEffect } from 'react';
import './App.css';
import RegexForm from './RegexForm';
import Results from './Results';

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
                matches = await testRegexPython(regex, testString, flags);
            } else {
                matches = testRegexJava(regex, testString, flags);
            }
            setResults(matches);
        } catch (e) {
            setResults('Invalid regular expression');
        }
    };

    const testRegexPython = async (pattern, testString, flags) => {
        try {
            const flagStr = Object.keys(flags).filter(flag => flags[flag].checked).join('');
            const code = `
import re

def test(pattern, test_string, flag_str):
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
    for flag in flag_str:
        combined_flags |= flag_dict[flag]

    try:
        regex = re.compile(pattern, combined_flags)
        matches = regex.findall(test_string)
        return bool(regex.search(test_string))
    except re.error as e:
        return f"Invalid regular expression: {e}"

pattern = r'''${pattern}'''
test_string = '''${testString}'''
flag_str = '''${flagStr}'''

test(pattern, test_string, flag_str)
      `;
            await pyodide.loadPackagesFromImports(code);
            const result = await pyodide.runPythonAsync(code);
            return result;
        } catch (e) {
            return 'Invalid regular expression';
        }
    };

    const testRegexJava = (pattern, testString, flags) => {
        // Mock function to simulate Java regex matching
        try {
            const flagStr = Object.keys(flags).filter(flag => flags[flag].checked).join('');
            const re = new RegExp(pattern, flagStr);
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
            <RegexForm
                engine={engine}
                setEngine={setEngine}
                regex={regex}
                setRegex={setRegex}
                testString={testString}
                setTestString={setTestString}
                flags={flags}
                handleFlagChange={handleFlagChange}
                handleTest={handleTest}
            />
            <Results results={results} />
        </div>
    );
}

export default App;
