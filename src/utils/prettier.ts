import type { Options } from 'prettier';
import ReactGA from 'react-ga';
import { format } from 'prettier/standalone';
import tsParser from 'prettier/parser-typescript';

import prettierDefaultConfig from '../constants/prettier';

const config: Options = {
    parser: 'typescript',
    plugins: [tsParser],
    ...JSON.parse(prettierDefaultConfig),
};

export const prettify = (
    uglyString: string,
    errorCallback: (error: unknown) => void
) => {
    try {
        return format(uglyString, config);
    } catch (error) {
        if (errorCallback) {
            errorCallback(error);

            ReactGA.exception({
                description:
                    // @ts-ignore - TODO: Fix types
                    error && error.message
                        ? // @ts-ignore - TODO: Fix types
                          error.message
                        : 'prettify error',
                fatal: false,
            });
        }
    }
};
