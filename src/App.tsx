import React, { FormEvent, useCallback, useState } from 'react';
import CodeMirror from 'react-codemirror';
// @ts-ignore
import * as espree from 'espree';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/jsx/jsx';

const useParsePseudo = (pseudoCode: string): any => {
    const ast = espree.parse(pseudoCode, {
        ecmaVersion: 6,
        ecmaFeatures: {
            jsx: true
        }
    });

    return ast;
};

const App = () => {
    const [pseudoCode, setPseudoCode] = useState(
        `<Layout>\n    <Header />\n    <Main />\n    <Footer />\n</Layout>`
    );

    const ast = useParsePseudo(pseudoCode);
    console.log(ast);

    const handleEditorChange = useCallback(
        (text: string): void => setPseudoCode(text),
        []
    );

    const handleSave = useCallback((event: FormEvent): void => {
        event.preventDefault();
    }, []);

    const editorOptions = { lineNumbers: true };

    return (
        <div>
            <h1 className="text-2xl">Pseudopia</h1>
            <div className="grid md:grid-cols-2 gap-2">
                <form onSubmit={handleSave}>
                    <CodeMirror
                        autoFocus
                        className="border-2 border-slate-800"
                        name="pseudoCode"
                        onChange={handleEditorChange}
                        options={editorOptions}
                        value={pseudoCode}
                    />
                    <button
                        className="bg-slate-800 text-white border-2 border-slate-800 py-2 px-4 rounded-md"
                        type="submit"
                    >
                        Save
                    </button>
                </form>
                <div>Other stuff</div>
            </div>
        </div>
    );
};

export default App;
