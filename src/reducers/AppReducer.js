import { appDataActionHandler } from './AppReducerDataActions';
import { appUIActionHandler } from './AppReducerUIActions';


const initState = {
    appData: null,
    appFile: {},
    appUI: {
        mode: 'dark',
        activeCollectionPath: null,
        dataUI: null,
    }
}

const AppReducer = (state = initState, action) => {
    state = appUIActionHandler(state, action)
    state = appDataActionHandler(state, action)
    return state
}
export default AppReducer 
