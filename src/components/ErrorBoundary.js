import React from 'react';
import ReactGA from 'react-ga';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        ReactGA.exception({
            description:
                error && error.message ? error.message : 'ErrorBoundary hit',
            fatal: true,
        });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="bg-red-600 text-white px-4 py-2">
                    <h2 className="text-3xl">Uh oh. An error has occurred.</h2>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
