import React from 'react';
import ReactGA from 'react-ga';
// @ts-ignore
import Tree from 'ascii-tree';

interface TreeProps {
    data: any;
}

const FileTree: React.FunctionComponent<TreeProps> = ({ data }) => {
    let tree = '';

    try {
        tree = Tree.generate(data);
    } catch (error) {
        // tree = 'Component tree is invalid...';

        ReactGA.exception({
            description:
                // @ts-ignore
                error && error.message ? error.message : 'FileTree error',
            fatal: false,
        });
    }

    return (
        <pre className="border-2 border-slate-900 bg-gray-800 rounded-md p-4">
            <code>{tree}</code>
        </pre>
    );
};

export default FileTree;
