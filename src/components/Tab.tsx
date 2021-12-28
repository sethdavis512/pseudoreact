import React from 'react';
import { useTabContext } from './Tabs';

interface TabProps {
    id: string;
}

const Tab: React.FunctionComponent<TabProps> = ({ children, id }) => {
    // @ts-ignore - Fix types
    const { currentTab, handleSetCurrentTab } = useTabContext();

    const tabClassName = [
        'h-10 px-4 py-2 mx-1 text-sm text-center text-slate-500 bg-transparent border-b-2 border-slate-500 sm:text-base whitespace-nowrap focus:outline-none',
        currentTab === id
            ? 'border-cyan-400 dark:border-cyan-400 dark:text-cyan-400'
            : '',
    ].join();

    return (
        <button
            id={id}
            className={tabClassName}
            onClick={handleSetCurrentTab}
            type="button"
        >
            {children}
        </button>
    );
};

export default Tab;
