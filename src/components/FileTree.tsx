import React from 'react';
// @ts-ignore
import Tree from 'ascii-tree';

const FileTree = () => {
    const tree = Tree.generate('#node\r\n##second');

    return (
        <pre className="border-2 border-slate-900 bg-gray-800 rounded-md p-4">
            <code>{tree}</code>
        </pre>
    );
};

export default FileTree;
