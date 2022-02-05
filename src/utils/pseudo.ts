import ReactGA from 'react-ga';
import { handleAst, parseJsx, PseudoItem, defineTreeStructure } from './parser';

export const convertPseudoToData = (pseudoCode: string): any => {
    try {
        const ast = parseJsx(pseudoCode);

        if (ast && ast.body) {
            return {
                astResult: handleAst(ast.body),
                treeResult: defineTreeStructure(),
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
                // @ts-ignore - TODO: Fix types
                error && error.message
                    ? // @ts-ignore - TODO: Fix types
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
            // @ts-ignore - TODO: Fix types
            if (!tracker[currentItem.name]) {
                // @ts-ignore - TODO: Fix types
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
