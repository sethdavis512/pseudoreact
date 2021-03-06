import ReactGA from 'react-ga';
// @ts-ignore - Types don't exist...?
import * as espree from 'espree';

// @ts-ignore - TODO: Fix types
const isExcluded = ({ openingElement }) =>
    [
        'button',
        'div',
        'footer',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'header',
        'input',
        'p',
        'section',
        'span',
    ].indexOf(openingElement.name.name) > -1;

export const parseJsx = (
    code: string,
    errorCallback?: (error: unknown) => void
) => {
    try {
        return espree.parse(code, {
            ecmaVersion: 6,
            ecmaFeatures: {
                jsx: true,
            },
        });
    } catch (error) {
        if (errorCallback) {
            errorCallback(error);

            ReactGA.exception({
                description:
                    // @ts-ignore - TODO: Fix types
                    error && error.message
                        ? // @ts-ignore - TODO: Fix types
                          error.message
                        : 'parseJsx error',
                fatal: false,
            });
        }
    }
};

export interface PseudoItem {
    name: string;
    props: string[];
}

// @ts-ignore - TODO: Fix types
export const handleAst = (body) => {
    const output: PseudoItem[] = [];
    // @ts-ignore - TODO: Fix types
    const getChildren = (component) => {
        if (component.type === 'JSXElement' && !isExcluded(component)) {
            const { name: componentName, attributes: propsArr } =
                component.openingElement;

            output.push({
                name: componentName.name,
                // @ts-ignore - TODO: Fix types
                props: propsArr.map((p) => p.name.name),
            });

            component.children
                // @ts-ignore - TODO: Fix types
                .filter(({ type }) => type === 'JSXElement')
                .forEach(getChildren);
        }
    };

    // @ts-ignore - TODO: Fix types
    body.forEach((top) => getChildren(top.expression));

    return output;
};

export const defineTreeStructure = (): string => {
    // TODO: Revisit this idea. I want to have a "real time" tree get generated
    // when PseudoCode is being written...
    return `#Layout.tsx\n##components\n###Header.tsx\n###Main.tsx\n###Footer.tsx`;
};
