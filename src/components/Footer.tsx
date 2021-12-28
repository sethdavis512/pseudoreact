import React from 'react';

const Footer: React.FunctionComponent = ({ children }) => {
    return (
        <footer className="px-6 py-8 border-t-2 border-slate-900">
            {children}
        </footer>
    );
};

export default Footer;
