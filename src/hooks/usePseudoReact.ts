import { useReducer, useEffect } from 'react';
import {
    childComponentTemplate,
    pseudoCodeTemplate,
    rootComponentTemplate,
} from '../constants/templates';

const initialPseudoReactConfig = {
    pseudoCode: pseudoCodeTemplate,
    rootComponent: rootComponentTemplate,
    childComponent: childComponentTemplate,
};

const LOCAL_STORAGE_KEY = 'pseudoReactApp';

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
        null,
        () => {
            const local = localStorage.getItem(LOCAL_STORAGE_KEY);

            if (local) {
                return JSON.parse(local);
            } else {
                return initialPseudoReactConfig;
            }
        }
    );

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pseudoState));
    }, [pseudoState]);

    const state = {
        ...pseudoState,
    };

    const actions = {
        dispatch: pseudoDispatch,
    };

    return [state, actions];
};

export default usePseudoReact;
