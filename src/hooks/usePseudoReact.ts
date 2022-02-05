import {
    childComponentTemplate,
    pseudoCodeTemplate,
    rootComponentTemplate,
} from '../constants/templates';
import useLocalStorage from './useLocalStorage';

export interface PseudoReactState {
    pseudoCode: string;
    rootComponent: string;
    childComponent: string;
}

interface PseudoReactActions {
    updateTemplate: (targetKey: string, text: string) => void;
    resetTemplates: () => void;
}

type UpdateStatePayload = {
    targetKey: string;
    text: string;
};

type PseudoReactActionTypes =
    | {
          type: 'UPDATE_STATE';
          payload: UpdateStatePayload;
      }
    | {
          type: 'RESET_TEMPLATES';
      };

const getInitialPseudoReactConfig = (): PseudoReactState => ({
    pseudoCode: pseudoCodeTemplate,
    rootComponent: rootComponentTemplate,
    childComponent: childComponentTemplate,
});

const LOCAL_STORAGE_KEY = 'pseudoReactApp';

const usePseudoReact = (): [PseudoReactState, PseudoReactActions] => {
    // TODO: Update hook to useReducer pattern
    const stateReducer = (
        state: PseudoReactState,
        action: PseudoReactActionTypes
    ) => {
        if (action.type === 'UPDATE_STATE') {
            return {
                ...state,
                [action.payload.targetKey]: action.payload.text,
            };
        }

        if (action.type === 'RESET_TEMPLATES') {
            return getInitialPseudoReactConfig();
        }

        return state;
    };

    // TODO: Remove hook, apply useReducer pattern
    const [storedPseudoState, setStoredPseudoState] = useLocalStorage(
        LOCAL_STORAGE_KEY,
        getInitialPseudoReactConfig()
    );

    const actions = {
        updateTemplate: (targetKey: string, text: string) => {
            setStoredPseudoState(
                stateReducer(storedPseudoState, {
                    type: 'UPDATE_STATE',
                    payload: {
                        targetKey,
                        text,
                    },
                })
            );
        },
        resetTemplates: () => {
            setStoredPseudoState(
                stateReducer(storedPseudoState, {
                    type: 'RESET_TEMPLATES',
                })
            );
        },
    };

    return [storedPseudoState, actions];
};

export default usePseudoReact;
