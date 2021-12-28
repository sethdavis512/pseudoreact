import React, { createContext, useContext, useState } from 'react';

interface TabsProps {
    initialTabId: string;
}

const TabContext = createContext(null);

export const useTabContext = () => useContext(TabContext);

const Tabs: React.FunctionComponent<TabsProps> = ({
    children,
    initialTabId,
}) => {
    const [currentTab, setCurrentTab] = useState(initialTabId);

    // @ts-ignore - Fix types
    const handleSetCurrentTab = (event) => {
        setCurrentTab(event.target.id);
    };

    return (
        // @ts-ignore - Fix types
        <TabContext.Provider value={{ currentTab, handleSetCurrentTab }}>
            {children}
        </TabContext.Provider>
    );
};

export default Tabs;
