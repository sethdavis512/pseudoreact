import { handleAst, parseJsx, PseudoItem } from './parserUtils';

export const convertPseudoToData = (pseudoCode: string): any => {
    try {
        const ast = parseJsx(pseudoCode);

        if (ast) {
            return handleAst(ast.body);
        }
    } catch (error) {
        console.error(error);
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
