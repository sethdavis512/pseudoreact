import { useReducer } from 'react';
import {
    childComponentTemplate,
    pseudoCodeTemplate,
    rootComponentTemplate
} from '../constants/templates';

const initialPseudoReactConfig = {
    pseudoCode: pseudoCodeTemplate,
    rootComponent: rootComponentTemplate,
    childComponent: childComponentTemplate,
};

const usePseudoReact = () => {
    const [pseudoState, pseudoDispatch] = useReducer(
        // @ts-ignore - TODO: Fix types
        (state, action) => {
            if (action.type === 'UPDATE_STATE') {
                return {
                    ...state,
                    [action.payload.targetKey]: action.payload.text,
                };
            }

            return state;
        },
        initialPseudoReactConfig
    );

    const state = {
        ...pseudoState,
    };

    const actions = {
        dispatch: pseudoDispatch,
    };

    return [state, actions];
};

export default usePseudoReact;
