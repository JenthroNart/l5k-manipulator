import update from 'immutability-helper';
import get from 'lodash/get';
import set from 'lodash/set';
import has from 'lodash/has';
import forEach from 'lodash/forEach';
import findIndex from 'lodash/findIndex';
import replace from 'lodash/replace';
import { fileDataWrangling } from './fileDataWrangling';

const APP_DATA_ACTION = {
    READ_FILE: 'readFile',
    PARSE_FILE: 'parseFile',
    DELETE_ITEMS: 'deleteItems',
}

const appDataActionHandler = (state, action) => {
    switch (action.type) {
        case APP_DATA_ACTION.READ_FILE:
            !has(state, 'appFile.fileParseReq') && set(state, 'appFile.fileParseReq', 0)
            state = update(state, {
                appFile: {
                    inputfileName: { $set: action.fileName },
                    inputFile: { $set: action.result },
                    outputFileName: { $set: 'Gtran07-'.concat(action.fileName) },
                    outputFile: { $set: null },
                    fileParseReq: { $set: get(state, 'appFile.fileParseReq') + 1 }
                }
            })
            return state

        case APP_DATA_ACTION.PARSE_FILE:
            const file = get(state, 'appFile.inputFile')
            const { data, result, message } = fileDataWrangling(file)
            //---------UI management when new data coming in
            if (result === 'successful') {
                !has(state, ['appUI', 'dataUI', data.Type, "Items"]) && set(state, ['appUI', 'dataUI', data.Type, "Items"], null)
                state = update(state, { appUI: { dataUI: { [data.Type]: { Items: { $set: data.Items } } } } })
            }

            //raise warning message if passing data fail or set default app UI when new data came in
            else state = update(state, {
                appUI: {
                    dataUI: { $set: null },
                    appDialog: { $set: { title: 'Fail to Read', content: message.name + ' in "' + file.fileName + '": ' + message.message } }
                }
            })
            return state

        case APP_DATA_ACTION.DELETE_ITEMS:
            let resultFile = get(state, 'appFile.inputFile')
            forEach(action.data, item => {
                const items = get(state, ['appUI', 'dataUI', item.type, 'Items'])
                const index = findIndex(items, { verbose_name: item.verbose_name })
                //Handling UI data
                state = update(state, { appUI: { dataUI: { [item.type]: { Items: { $splice: [[index, 1]] } } } } })
                //Handling the input file
                resultFile = replace(resultFile, item.content, '')
            })
            state = update(state, { appFile: { outputFile: { $set: resultFile } } })
            return state

        default:
            return state
    }
}

export { APP_DATA_ACTION, appDataActionHandler }