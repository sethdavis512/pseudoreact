import { useEffect, useState } from 'react';
import { OutboundLink } from 'react-ga';
import { Helmet } from 'react-helmet';

import Editor from './components/Editor';
import ErrorBoundary from './components/ErrorBoundary';
import FileTree from './components/FileTree';
import Footer from './components/Footer';
import Logo from './components/Logo';
import Tab from './components/Tab';
import TabContent from './components/TabContent';
import Tabs from './components/Tabs';
import useBodyClass from './hooks/useBodyClass';
import usePseudoReact from './hooks/usePseudoReact';
import { convertPseudoToData } from './utils/pseudo';
import { createHandleSave } from './utils/app';
import { encodedTweetText } from './constants/app';

export default function App() {
    const [pseudoState, pseudoActions] = usePseudoReact();

    // Manually add tailwind classs to the body
    // TODO: Replace with better method...
    useBodyClass('bg-slate-800');
    useBodyClass('text-white');
    useBodyClass('h-full');

    const pseudoData = convertPseudoToData(pseudoState.pseudoCode);

    const createHandleEditorChange =
        (targetKey: string) =>
        (text: string): void =>
            pseudoActions.updateTemplate(targetKey, text);

    const [errorState, setErrorState] = useState('');
    // @ts-ignore - TODO: Fix types
    const createHandleError = (errorMessage) => (error: Error) =>
        setErrorState(`${errorMessage}\n\n${error.message}`);

    const handleSave = createHandleSave({
        pseudoData,
        pseudoState,
        createHandleError,
        errorState,
    });

    useEffect(() => {
        setTimeout(() => {
            setErrorState('');
        }, 3000);
    }, [errorState]);

    return (
        <div className="flex flex-col h-full">
            <Helmet>
                <title>PseudoReact | Write pseudo React, get components</title>
                <meta name="author" content="Seth Davis" />
                <meta
                    name="description"
                    content="Write pseudo React, get components"
                />
                <meta
                    name="keywords"
                    content="React, pseudo, PseudoReact, pseudo code, coding, app, tool"
                />
            </Helmet>
            <header className="flex flex-col lg:flex-row items-center px-6 py-4 justify-between border-b-2 border-slate-900 bg-slate-800 sticky top-0 z-10 mb-8">
                <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-0">
                    <div className="w-64 md:mr-4">
                        <Logo />
                    </div>
                    <span className="text-sm sm:pl-2">
                        Write pseudo React, get components.
                    </span>
                </div>
                <nav className="w-full sm:w-auto py-2 sm:py-0">
                    <ul className="flex flex-col sm:flex-row items-center justify-center lg:justify-end text-center">
                        <li className="w-full sm:w-auto mr-2">
                            <OutboundLink
                                className="block sm:inline-block px-4 py-3 hover:bg-slate-900 rounded-md"
                                eventLabel="gitHubLink"
                                target="_blank"
                                to="https://github.com/sethdavis512/pseudoreact"
                            >
                                GitHub
                            </OutboundLink>
                        </li>
                        <li className="w-full sm:w-auto mr-2">
                            <OutboundLink
                                className="block sm:inline-block px-4 py-3 hover:bg-slate-900 rounded-md"
                                eventLabel="foundBug"
                                target="_blank"
                                to="https://github.com/sethdavis512/pseudoreact/issues"
                            >
                                Find a bug?
                            </OutboundLink>
                        </li>
                        <li className="w-full sm:w-auto">
                            <OutboundLink
                                className="block sm:inline-block px-4 py-3 hover:bg-slate-900 rounded-md"
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
            <main className="px-6 flex-grow mb-8">
                <ErrorBoundary>
                    <form onSubmit={handleSave}>
                        <div className="grid md:grid-cols-8 gap-6">
                            <div className="col-span-full md:col-span-3 border-2 border-slate-900 rounded-md p-6">
                                <h2 className="text-3xl font-bold mb-4">
                                    What is PseudoReact?
                                </h2>
                                <p className="mb-8">
                                    A tool that expedites component creation by
                                    leveraging composed, pseudo JSX to write
                                    files.
                                </p>
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
                                    <FileTree data={pseudoData.treeResult} />
                                </div>
                            </div>
                            <div className="col-span-full md:col-span-5">
                                <div className="mb-8">
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
                                                value={pseudoState.pseudoCode}
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
                                                value={
                                                    pseudoState.rootComponent
                                                }
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
                                                value={
                                                    pseudoState.childComponent
                                                }
                                            />
                                        </TabContent>
                                    </Tabs>
                                </div>
                                {errorState && (
                                    <div className="bg-red-600 text-white p-4 mb-8">
                                        <p>{errorState}</p>
                                    </div>
                                )}
                                <div>
                                    <button
                                        className="bg-slate-800 hover:bg-slate-900 border-2 border-slate-900 text-white py-2 px-4 rounded-md mr-4 hidden"
                                        onClick={pseudoActions.resetTemplates}
                                        type="button"
                                    >
                                        Reset templates
                                    </button>
                                    <button
                                        className="bg-green-500 hover:bg-green-400 text-white py-2 px-4 rounded-md"
                                        type="submit"
                                    >
                                        Download zip
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </ErrorBoundary>
            </main>
            <Footer />
        </div>
    );
}
