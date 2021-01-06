import update from 'immutability-helper';
import get from 'lodash/get';
import set from 'lodash/set';
import has from 'lodash/has';
import forEach from 'lodash/forEach';
import findIndex from 'lodash/findIndex';
import replace from 'lodash/replace';
import { L5K_Component, parseL5K } from '../ultility/L5K';
import keys from 'lodash/keys';

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
                    outputFile: { $set: action.result },
                    fileParseReq: { $set: get(state, 'appFile.fileParseReq') + 1 }
                }
            })
            return state
        case APP_DATA_ACTION.PARSE_FILE:
            const file = get(state, 'appFile.inputFile')
            const { parsedData, status, message } = parseL5K(file)
            //---------UI management when new data coming in
            if (status === 'successful') {
                state = update(state, { appUI: { dataUI: { $set: parsedData } } })
                //Expose selective data to user
                const visibleData = []
                keys(parsedData).forEach(item => {
                    [L5K_Component.Routine, L5K_Component.Program, L5K_Component.Tag, L5K_Component.DataType, L5K_Component.AddOnInstruction, L5K_Component.Module].includes(item) && visibleData.push(item)
                })
                state = update(state, { appUI: { dataUI: { visibleData: { $set: visibleData } } } })
                if (visibleData.length > 0) state = update(state, { appUI: { activeCollectionPath: { $set: visibleData[0] } } })
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
            let resultFile = get(state, 'appFile.outputFile')
            forEach(action.data, item => {
                const items = get(state, 'appUI.dataUI.' + state.appUI.activeCollectionPath + '.items')
                const index = findIndex(items, { verbose_name: item.verbose_name })
                const result = update(items, { $splice: [[index, 1]] })
                //Handling UI data
                set(state, 'appUI.dataUI.' + state.appUI.activeCollectionPath + '.items', result)
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