import type { Options } from 'prettier';
import { format } from 'prettier/standalone';
import tsParser from 'prettier/parser-typescript';

import prettierDefaultConfig from '../constants/prettierDefault';

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
        }
    }
};
