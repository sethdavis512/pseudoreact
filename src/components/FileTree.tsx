import ReactGA from 'react-ga';
// @ts-ignore - TODO: Fix types
import Tree from 'ascii-tree';

interface TreeProps {
    data: any;
}

const FileTree: React.FunctionComponent<TreeProps> = ({ data }) => {
    let tree = '';

    try {
        tree = Tree.generate(data);
    } catch (error) {
        console.log({ error });

        // tree = 'Component tree is invalid...';

        ReactGA.exception({
            description:
                // @ts-ignore
                error && error.message ? error.message : 'FileTree error',
            fatal: false,
        });
    }

    return (
        <pre className="border-2 border-black bg-gray-900 rounded-md p-4">
            <code>{tree}</code>
        </pre>
    );
};

export default FileTree;
