import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';

import App from './App';
import reportWebVitals from './reportWebVitals';

import './index.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/theme/monokai.css';

// @ts-ignore - TODO: Fix types
ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_CODE);

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// @ts-ignore - TODO: Fix types
function sendToAnalytics({ id, name, value }) {
    ReactGA.ga({
        eventCategory: 'Web Vitals',
        eventAction: name,
        eventValue: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
        eventLabel: id, // id unique to current page load
        nonInteraction: true, // avoids affecting bounce rate
    });
}

reportWebVitals(sendToAnalytics);
