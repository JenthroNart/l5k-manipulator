import update from 'immutability-helper';
import has from 'lodash/has';
import keys from 'lodash/keys';



const APP_UI_ACTION = {
    TOGGLE_UI_MODE: 'toggleUIMode',
    CLOSE_APP_DIALOG: 'closeAppDialog',
    OPEN_APP_DIALOG: 'openAppDialog',
}

const appUIActionHandler = (state, action) => {

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