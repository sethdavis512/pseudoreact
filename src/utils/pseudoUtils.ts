import ReactGA from 'react-ga';
import {
    handleAst,
    parseJsx,
    PseudoItem,
    defineTreeStructure,
} from './parserUtils';

export const convertPseudoToData = (pseudoCode: string): any => {
    try {
        const ast = parseJsx(pseudoCode);

        if (ast && ast.body) {
            return {
                astResult: handleAst(ast.body),
                treeResult: defineTreeStructure(ast.body),
            };
        }

        return {
            astResult: null,
            treeResult: null,
        };
    } catch (error) {
        console.error(error);

        ReactGA.exception({
            description:
                // @ts-ignore
                error && error.message
                    ? // @ts-ignore
                      error.message
                    : 'convertPseudoToData error',
            fatal: false,
        });
    }
};

export const getUniqueImports = (arrayOfPseudoItems: PseudoItem[]) => {
    const tracker = {};

    return arrayOfPseudoItems.reduce(
        (uniqueImports: PseudoItem[], currentItem: PseudoItem) => {
            // @ts-ignore
            if (!tracker[currentItem.name]) {
                // @ts-ignore
                tracker[currentItem.name] = 1;

                uniqueImports.push({
                    ...currentItem,
                });
            }

            return uniqueImports;
        },
        []
    );
};

export const getUniqueId = (prefix: string) =>
    `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
