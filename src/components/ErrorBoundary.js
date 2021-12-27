import React from 'react';

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
        // Log something...
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1 className="text-3xl">Uh oh. An error has occurred.</h1>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
