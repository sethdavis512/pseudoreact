import React, { FormEvent, useState } from 'react';

import Editor from './components/Editor';
import ErrorBoundary from './components/ErrorBoundary';
import Logo from './components/Logo';
import usePseudopia from './hooks/usePseudopia';
import { compileContent } from './utils/mustacheUtils';
import {
    convertPseudoToData,
    getUniqueId,
    getUniqueImports,
} from './utils/pseudoUtils';
import { prettify } from './utils/prettierUtils';
import { addFileToZip, saveZip } from './utils/zipUtils';
import useBodyClass from './hooks/useBodyClass';
import Footer from './components/Footer';

const NESTED_DIR_NAME = 'components';

const App: React.FunctionComponent = () => {
    const [state, actions] = usePseudopia();

    // TODO: Make this better...
    useBodyClass('bg-slate-800');
    useBodyClass('text-white');

    const pseudopiaArr = convertPseudoToData(state.pseudoCode);

    const createHandleEditorChange =
        (targetKey: string) =>
        (text: string): void =>
            actions.dispatch({
                type: 'UPDATE_STATE',
                payload: {
                    targetKey,
                    text,
                },
            });

    const [errorState, setErrorState] = useState('');
    // @ts-ignore - Fix types
    const createHandleError = (errorMessage) => (error: unknown) =>
        setErrorState(errorMessage);

    const handleSave = (event: FormEvent): void => {
        event.preventDefault();

        const uniqueComponents = getUniqueImports(pseudopiaArr);
        const rootComponentData = uniqueComponents.shift();

        const compiledRoot = compileContent(
            state.rootComponent,
            {
                ...rootComponentData,
                render: state.pseudoCode,
                imports: uniqueComponents.map((component) => ({
                    childName: component.name,
                    componentDirName: NESTED_DIR_NAME,
                })),
            },
            createHandleError('Root component has encountered an issue...')
        );

        // @ts-ignore - Fix types
        addFileToZip(rootComponentData.name, undefined, prettify(compiledRoot));

        uniqueComponents.forEach((pseudoItem: any) => {
            const compiled = compileContent(
                state.childComponent,
                pseudoItem,
                createHandleError(
                    'Compiling child component has encountered an issue...'
                )
            );
            addFileToZip(
                `/${NESTED_DIR_NAME}/${pseudoItem.name}`,
                undefined,
                prettify(
                    compiled,
                    createHandleError(
                        'Formatting process has encountered an issue...'
                    )
                )
            );
        });

        saveZip(getUniqueId('pseudopia'));
    };

    return (
        <div>
            <header className="flex flex-row items-center px-6 py-4 justify-between border-b-2 border-slate-900 bg-slate-800 mb-8 sticky top-0 z-10">
                <div className="flex flex-row items-center">
                    <div className="w-64 md:mr-4">
                        <Logo />
                    </div>
                    <span className="text-sm">
                        Write pseudo React, get components.
                    </span>
                </div>
                <nav>
                    <ul className="flex flex-row items-center">
                        <li className="px-4 py-2 mr-2 hover:bg-slate-900 rounded-md">
                            Reach
                        </li>
                        <li className="px-4 py-2 hover:bg-slate-900 rounded-md">
                            <a href="https://twitter.com/intent/tweet?text=Write%20pseudo%20React,%20get%20components&via=sethdavis512">
                                Share on Twitter
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>
            {errorState && <div>{errorState}</div>}
            <ErrorBoundary>
                <main className="px-6">
                    <form onSubmit={handleSave}>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <div className="mb-4">
                                    <h2>Pseudo Code</h2>
                                    <Editor
                                        handleChange={createHandleEditorChange(
                                            'pseudoCode'
                                        )}
                                        value={state.pseudoCode}
                                    />
                                </div>
                                <div className="mb-4">
                                    <h2>Root Component Template</h2>
                                    <Editor
                                        handleChange={createHandleEditorChange(
                                            'rootComponent'
                                        )}
                                        value={state.rootComponent}
                                    />
                                </div>
                                <div className="mb-4">
                                    <h2>Child Component Template</h2>
                                    <Editor
                                        handleChange={createHandleEditorChange(
                                            'childComponent'
                                        )}
                                        value={state.childComponent}
                                    />
                                </div>
                            </div>
                            <div>
                                <p>
                                    Lorem ipsum, dolor sit amet consectetur
                                    adipisicing elit. Veniam ratione, iusto
                                    eaque molestias temporibus qui repudiandae
                                    quos adipisci magnam ea tempore at sint sit
                                    sunt fugiat sequi error officiis fugit?
                                </p>
                                <button
                                    className="bg-green-500 hover:bg-green-400 text-white py-2 px-4 rounded-md"
                                    type="submit"
                                >
                                    Get zip file
                                </button>
                            </div>
                        </div>
                    </form>
                </main>
            </ErrorBoundary>
            <Footer>Fooooooter!</Footer>
        </div>
    );
};

export default App;
