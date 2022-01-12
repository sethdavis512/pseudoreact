import {
    childComponentTemplate,
    pseudoCodeTemplate,
    rootComponentTemplate,
} from '../constants/templates';
import useLocalStorage from './useLocalStorage';

interface PseudoReactState {
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

    const [pseudoReactState, setPseudoReactState] = useLocalStorage(
        LOCAL_STORAGE_KEY,
        getInitialPseudoReactConfig()
    );

    const actions = {
        updateTemplate: (targetKey: string, text: string) => {
            setPseudoReactState(
                stateReducer(pseudoReactState, {
                    type: 'UPDATE_STATE',
                    payload: {
                        targetKey,
                        text,
                    },
                })
            );
        },
        resetTemplates: () => {
            setPseudoReactState(
                stateReducer(pseudoReactState, {
                    type: 'RESET_TEMPLATES',
                })
            );
        },
    };

    return [pseudoReactState, actions];
};

export default usePseudoReact;
