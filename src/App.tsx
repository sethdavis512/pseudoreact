import React, { FormEvent, useState } from 'react';

import Editor from './components/Editor';
import ErrorBoundary from './components/ErrorBoundary';
import Logo from './components/Logo';
import usePseudoReact from './hooks/usePseudoReact';
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
import Tabs from './components/Tabs';
import Tab from './components/Tab';
import TabContent from './components/TabContent';
import FileTree from './components/FileTree';

const NESTED_DIR_NAME = 'components';

const App: React.FunctionComponent = () => {
    const [state, actions] = usePseudoReact();

    // TODO: Make this better...
    useBodyClass('bg-slate-800');
    useBodyClass('text-white');
    useBodyClass('h-full');

    const pseudoData = convertPseudoToData(state.pseudoCode);

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

        const uniqueComponents = getUniqueImports(pseudoData.astResult);
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

        saveZip(getUniqueId('pseudoreact'));
    };

    return (
        <div className="flex flex-col h-full">
            <header className="flex flex-col sm:flex-row items-center px-6 py-4 justify-between border-b-2 border-slate-900 bg-slate-800 mb-8 sticky top-0 z-10">
                <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-0">
                    <div className="w-64 md:mr-4">
                        <Logo />
                    </div>
                    <span className="text-sm sm:pl-2">
                        Write pseudo React, get components.
                    </span>
                </div>
                <nav>
                    <ul className="flex flex-row items-center">
                        {/* <li className="px-4 py-2 mr-2 hover:bg-slate-900 rounded-md">
                            Reach
                        </li> */}
                        <li className="px-4 py-3 hover:bg-slate-900 rounded-md">
                            <a href="https://twitter.com/intent/tweet?text=Write%20pseudo%20React,%20get%20components&via=sethdavis512">
                                Share on Twitter
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>
            {errorState && <div>{errorState}</div>}
            <main className="px-6 flex-grow mb-8">
                <ErrorBoundary>
                    <form onSubmit={handleSave}>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="order-2 sm:order-1">
                                <Tabs initialTabId="pseudoTab">
                                    <Tab id="pseudoTab">Pseudo</Tab>
                                    <Tab id="rootTab">Root</Tab>
                                    <Tab id="childTab">Child</Tab>
                                    <TabContent id="pseudoTab">
                                        <h2 className="mb-2 font-bold">
                                            Pseudo Code
                                        </h2>
                                        <Editor
                                            handleChange={createHandleEditorChange(
                                                'pseudoCode'
                                            )}
                                            value={state.pseudoCode}
                                        />
                                    </TabContent>
                                    <TabContent id="rootTab">
                                        <h2 className="mb-2 font-bold">
                                            Root Component Template
                                        </h2>
                                        <Editor
                                            handleChange={createHandleEditorChange(
                                                'rootComponent'
                                            )}
                                            value={state.rootComponent}
                                        />
                                    </TabContent>
                                    <TabContent id="childTab">
                                        <h2 className="mb-2 font-bold">
                                            Child Component Template
                                        </h2>
                                        <Editor
                                            handleChange={createHandleEditorChange(
                                                'childComponent'
                                            )}
                                            value={state.childComponent}
                                        />
                                    </TabContent>
                                </Tabs>
                            </div>
                            <div className="order-1 sm:order-2">
                                <h2 className="text-3xl font-bold mb-4">
                                    Instructions
                                </h2>
                                <div className="mb-4">
                                    <p>
                                        Lorem ipsum, dolor sit amet consectetur
                                        adipisicing elit. Veniam ratione, iusto
                                        eaque molestias temporibus qui
                                        repudiandae quos adipisci magnam ea
                                        tempore at sint sit sunt fugiat sequi
                                        error officiis fugit?
                                    </p>
                                    <ol className="list-inside">
                                        <li>This</li>
                                        <li>This</li>
                                        <li>This</li>
                                        <li>This</li>
                                    </ol>
                                </div>
                                <div className="mb-8 hidden">
                                    <FileTree data={pseudoData.treeResult} />
                                </div>
                                <button
                                    className="bg-green-500 hover:bg-green-400 text-white py-2 px-4 rounded-md"
                                    type="submit"
                                >
                                    Get zip file
                                </button>
                            </div>
                        </div>
                    </form>
                </ErrorBoundary>
            </main>
            <Footer>
                <p className="text-center">
                    <a href="https://www.buymeacoffee.com/sethdavis512">
                        Support the app
                    </a>
                </p>
            </Footer>
        </div>
    );
};

export default App;
