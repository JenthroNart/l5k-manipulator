import update from 'immutability-helper';
import get from 'lodash/get';
import has from 'lodash/has';
import set from 'lodash/set';
import keys from 'lodash/keys';


const APP_UI_ACTION = {
    TOGGLE_UI_MODE: 'toggleUIMode',
    SELECT_COLLECTION_ITEM: 'selectCollectionItem',
    SORT: 'sort',
    FILTER: 'filter',
    SET_DISPLAY_STYLE: 'setDisplayStyle',
    SET_DATA_FIELD_VISIBILITY: 'toggleDataFieldVisibility',
    SET_PLAY_ANIMATION: 'setPlayAnimation',
    CLOSE_APP_DIALOG: 'closeAppDialog',
    OPEN_APP_DIALOG: 'openAppDialog',
}

const appUIActionHandler = (state, action) => {
    const activeCollectionKey = get(state, 'appUI.activeCollectionKey');

    switch (action.type) {
        //Generic App UI Control
        case APP_UI_ACTION.TOGGLE_UI_MODE:
            state = update(state, { appUI: { mode: { $set: state.appUI.mode === 'dark' ? 'light' : 'dark' } } });
            return state;


        case APP_UI_ACTION.OPEN_APP_DIALOG:
            state = update(state, { appUI: { appDialog: { $set: action.information } } })
            return state;

        case APP_UI_ACTION.CLOSE_APP_DIALOG:
            state = update(state, { appUI: { appDialog: { $set: {} } } })
            return state;

        //App UI Data Manipulation
        case APP_UI_ACTION.SELECT_COLLECTION_ITEM:
            state = update(state, { appUI: { activeItemKey: { $set: action.itemKey }, activeCollectionKey: { $set: action.collectionKey } } });
            return state

        //Sort
        case APP_UI_ACTION.SORT:
            !has(state, ['appUI', 'dataUI', activeCollectionKey, 'sort']) && set(state, ['appUI', 'dataUI', activeCollectionKey, 'sort'], [])
            state = update(state, { appUI: { dataUI: { [activeCollectionKey]: { sort: { $set: action.data } } } } });
            return state
        //Filter
        case APP_UI_ACTION.FILTER:
            !has(state, ['appUI', 'dataUI', activeCollectionKey, 'filter']) && set(state, ['appUI', 'dataUI', activeCollectionKey, 'filter'], null)
            state = update(state, { appUI: { dataUI: { [activeCollectionKey]: { filter: { $set: action.data } } } } });
            return state

        default:
            return state
    }
}


const setDefaultAppUI = state => {
    //Default Active Collection
    const activeCollectionKey = keys(state.appData)[0]
    !has(state, 'appUI.activeCollectionKey') && has(state, 'appUI.activeCollectionKey', {})
    state = update(state, { appUI: { activeCollectionKey: { $set: activeCollectionKey }, activeItemKey: { $set: null }, dataUI: { $set: {} } } })
    return state
}
export { APP_UI_ACTION, appUIActionHandler, setDefaultAppUI }