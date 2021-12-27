import { useReducer } from 'react';
import {
    childComponentTemplate,
    pseudoCodeTemplate,
    rootComponentTemplate
} from '../constants/templates';

const initialPseudopiaConfig = {
    pseudoCode: pseudoCodeTemplate,
    rootComponent: rootComponentTemplate,
    childComponent: childComponentTemplate
};

const usePseudopia = () => {
    const [pseudopiaState, pseudopiaDispatch] = useReducer(
        // @ts-ignore - TODO: Fix types
        (state, action) => {
            if (action.type === 'UPDATE_STATE') {
                return {
                    ...state,
                    [action.payload.targetKey]: action.payload.text
                };
            }

            return state;
        },
        initialPseudopiaConfig
    );

    const state = {
        ...pseudopiaState
    };

    const actions = {
        dispatch: pseudopiaDispatch
    };

    return [state, actions];
};

export default usePseudopia;
