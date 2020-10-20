import update from 'immutability-helper';
import get from 'lodash/get';
import set from 'lodash/set';
import has from 'lodash/has';
import { setDefaultAppUI } from './AppReducerUIActions';
import {fileDataWrangling} from './fileDataWrangling'

const APP_DATA_ACTION = {
    READ_FILE: 'readFile',
    PARSE_FILE: 'parseFile',
}

const appDataActionHandler = (state, action) => {
    switch (action.type) {
        case APP_DATA_ACTION.READ_FILE:
            !has(state, 'appFile.fileName') && set(state, 'appFile.fileName', null)
            !has(state, 'appFile.content') && set(state, 'appFile.content', null)
            !has(state, 'appFile.fileParseReq') && set(state, 'appFile.fileParseReq', null)
            state = update(state, {
                appFile: {
                    fileName: { $set: action.fileName },
                    content: { $set: action.result },
                    fileParseReq: { $set: get(state, 'appFile.fileParseReq') + 1 }
                }
            })
            return state

        case APP_DATA_ACTION.PARSE_FILE:
            const file = get(state, 'appFile')
            const { data, result, message } = fileDataWrangling(file.content)
            //----------New Data has come in
            state = update(state, { appData: { $set: data } })
            state = update(state, { appFile: { $set: null } })
            //---------UI management when new data coming in
            if (result === 'successful') state = setDefaultAppUI(state)
            //raise warning message if passing data fail or set default app UI when new data came in
            else state = update(state, {
                appUI: {
                    dataUI: { $set: null },
                    activeCollectionKey: { $set: null },
                    activeItemKey: { $set: null },
                    appDialog: { $set: { title: 'Fail to Read', content: message.name + ' in "' + file.fileName + '": ' + message.message } }
                }
            })
            return state
        default:
            return state
    }
}

export { APP_DATA_ACTION, appDataActionHandler }