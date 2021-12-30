import ReactGA from 'react-ga';
import Mustache from 'mustache';

Mustache.escape = (text) => text;

// @ts-ignore - TODO: Fix types
export const compileContent = (templateString, data, errorCallback): string => {
    try {
        return Mustache.render(templateString, data);
    } catch (error) {
        if (errorCallback) {
            errorCallback(error);

            ReactGA.exception({
                description:
                    // @ts-ignore
                    error && error.message
                        ? // @ts-ignore
                          error.message
                        : 'Mustache parse error',
                fatal: false,
            });
        }
    }
};
