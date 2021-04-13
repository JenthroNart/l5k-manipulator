import update from 'immutability-helper';

const APP_UI_ACTION = {
    TOGGLE_UI_MODE: 'toggleUIMode',
    CLOSE_APP_DIALOG: 'closeAppDialog',
    OPEN_APP_DIALOG: 'openAppDialog',
    SELECT_COLLECTION: 'selectCollection',
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

        case APP_UI_ACTION.SELECT_COLLECTION:
            state = update(state, { appUI: { activeCollectionPath: { $set: action.path } } })
            return state;
        default:
            return state
    }
}
export {
    APP_UI_ACTION,
    appUIActionHandler
}