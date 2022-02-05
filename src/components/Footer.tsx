import { OutboundLink } from 'react-ga';

const Footer: React.FunctionComponent = () => {
    return (
        <footer className="px-6 py-6 border-t-2 border-slate-900">
            <div className="flex flex-col sm:flex-row justify-center items-center">
                <OutboundLink
                    className="px-4 py-3 mr-2 hover:bg-slate-900 rounded-md"
                    eventLabel="madeByLink"
                    target="_blank"
                    to="https://twitter.com/pseudoreact"
                >
                    Twitter
                </OutboundLink>
                <OutboundLink
                    className="px-4 py-3 mr-2 hover:bg-slate-900 rounded-md"
                    eventLabel="madeByLink"
                    target="_blank"
                    to="https://github.com/sethdavis512"
                >
                    Created by @sethdavis512
                </OutboundLink>
                <OutboundLink
                    className="px-4 py-3 hover:bg-slate-900 rounded-md"
                    eventLabel="supportLink"
                    target="_blank"
                    to="https://www.buymeacoffee.com/sethdavis512"
                >
                    Support
                </OutboundLink>
            </div>
        </footer>
    );
};

export default Footer;
