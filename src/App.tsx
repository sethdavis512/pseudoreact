import React, { FormEvent, useState } from 'react';
import ReactGA, { OutboundLink } from 'react-ga';

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

const TWEET_TEXT = `Write pseudo React, get components.

https://www.pseudoreact.com`;

const encodedTweetText = encodeURIComponent(TWEET_TEXT);

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

        ReactGA.event({
            category: 'User',
            action: 'Form submission',
            label: 'Zip download',
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
                        <li>
                            <OutboundLink
                                className="px-4 py-3 hover:bg-slate-900 rounded-md"
                                eventLabel="shareOnTwitter"
                                target="_blank"
                                to={`https://twitter.com/intent/tweet?text=${encodedTweetText}`} // &via=pseudoreact
                            >
                                Share on Twitter
                            </OutboundLink>
                        </li>
                    </ul>
                </nav>
            </header>
            {errorState && <div>{errorState}</div>}
            <main className="px-6 flex-grow mb-8">
                <ErrorBoundary>
                    <form onSubmit={handleSave}>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="order-2 sm:order-1">
                                <Tabs initialTabId="pseudoTab">
                                    <Tab id="pseudoTab">Pseudo</Tab>
                                    <Tab id="rootTab">Root</Tab>
                                    <Tab id="childTab">Component</Tab>
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
                                            Component Template
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
                                <div className="mb-8">
                                    <ul className="list-decimal list-inside">
                                        <li className="mb-2">
                                            <span className="inline-block mb-2">
                                                Add or edit pseudo React code in
                                                "Pseudo" tab
                                            </span>
                                            <div className="pl-4">
                                                <span className="inline-block mb-2 font-bold">
                                                    Optional
                                                </span>
                                                <ul className="pl-4 list-disc list-inside">
                                                    <li className="mb-2">
                                                        Edit root component
                                                        template code in the
                                                        "Root" tab
                                                    </li>
                                                    <li className="mb-2">
                                                        Edit component template
                                                        code in the "Component"
                                                        tab
                                                    </li>
                                                </ul>
                                            </div>
                                        </li>
                                        <li className="mb-2">
                                            Click "Download zip" to get
                                            generated files
                                        </li>
                                    </ul>
                                </div>
                                <div className="mb-8">
                                    <h2 className="mb-2 font-bold">
                                        Example Output
                                    </h2>
                                    <FileTree
                                        data={`#Layout.tsx\n##components\n###Header.tsx\n###Main.tsx\n###Footer.tsx`}
                                    />
                                </div>
                                <button
                                    className="bg-green-500 hover:bg-green-400 text-white py-2 px-4 rounded-md"
                                    type="submit"
                                >
                                    Download zip
                                </button>
                            </div>
                        </div>
                    </form>
                </ErrorBoundary>
            </main>
            <Footer>
                <div className="flex flex-col sm:flex-row justify-center items-center">
                    <OutboundLink
                        className="px-4 py-3 hover:bg-slate-900 rounded-md"
                        eventLabel="madeByLink"
                        target="_blank"
                        to="https://twitter.com/pseudoreact"
                    >
                        Twitter
                    </OutboundLink>
                    <span className="block mx-2 text-white">|</span>
                    <OutboundLink
                        className="px-4 py-3 hover:bg-slate-900 rounded-md"
                        eventLabel="madeByLink"
                        target="_blank"
                        to="https://github.com/sethdavis512"
                    >
                        Created by @sethdavis512
                    </OutboundLink>
                    <span className="block mx-2 text-white">|</span>
                    <OutboundLink
                        className="px-4 py-3 hover:bg-slate-900 rounded-md"
                        eventLabel="supportLink"
                        target="_blank"
                        to="https://www.buymeacoffee.com/sethdavis512"
                    >
                        Support
                    </OutboundLink>
                </div>
            </Footer>
        </div>
    );
};

export default App;
