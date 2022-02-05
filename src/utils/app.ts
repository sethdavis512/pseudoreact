import { FormEvent } from 'react';
import ReactGA from 'react-ga';
import { compileContent } from './mustache';
import { getUniqueId, getUniqueImports } from './pseudo';
import { prettify } from './prettier';
import { addFileToZip, saveZip } from './zip';
import { NESTED_DIR_NAME } from '../constants/app';

interface SaveConfig {
    pseudoData: any;
    pseudoState: any;
    createHandleError: any;
    errorState: any;
}

export const createHandleSave =
    ({ pseudoData, pseudoState, createHandleError, errorState }: SaveConfig) =>
    (event: FormEvent): void => {
        event.preventDefault();

        const uniqueComponents = getUniqueImports(pseudoData.astResult);
        const rootComponentData = uniqueComponents.shift();

        const compiledRoot = compileContent(
            pseudoState.rootComponent,
            {
                ...rootComponentData,
                render: pseudoState.pseudoCode,
                imports: uniqueComponents.map((component) => ({
                    childComponentName: component.name,
                    componentDirName: NESTED_DIR_NAME,
                })),
            },
            createHandleError('Root component has encountered an issue...')
        );

        // @ts-ignore - TODO: Fix types
        addFileToZip(rootComponentData.name, undefined, prettify(compiledRoot));

        uniqueComponents.forEach((pseudoItem: any) => {
            const compiled = compileContent(
                pseudoState.childComponent,
                pseudoItem,
                createHandleError(
                    'Compiling child component has encountered an issue...'
                )
            );
            addFileToZip(
                `/${NESTED_DIR_NAME}/${pseudoItem.name}`,
                undefined,
                prettify(
                    compiled,
                    // @ts-ignore - TODO: Fix types
                    createHandleError(
                        'Formatting process has encountered an issue...'
                    )
                )
            );
        });

        if (!errorState) {
            saveZip(getUniqueId('pseudoreact'));
            ReactGA.event({
                category: 'User',
                action: 'Form submission',
                label: 'Zip download',
            });
        }
    };
