import { useTabContext } from './Tabs';

interface TabContentProps {
    id: string;
}

const TabContent: React.FunctionComponent<TabContentProps> = ({
    children,
    id,
}) => {
    // @ts-ignore - TODO: Fix types
    const { currentTab } = useTabContext();

    if (id === currentTab) {
        return <div className="pt-4">{children}</div>;
    }

    return null;
};

export default TabContent;
