import React from 'react';
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
        tree = 'Component tree is invalid...';
        console.log(error);
    }

    return (
        <pre className="border-2 border-slate-900 bg-gray-800 rounded-md p-4">
            <code>{tree}</code>
        </pre>
    );
};

export default FileTree;
