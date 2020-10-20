import { store } from "../App";
import { saveAs } from 'file-saver';
import { APP_DATA_ACTION } from "../reducers/AppReducerDataActions";

const handleOpenFile = event => {
    if (event.target.files && event.target.files.length > 0) {
        const reader = new FileReader();
        reader.input = event.target
        reader.fileName = event.target.files[0].name
        reader.onload = e => {
            store.dispatch({ type: APP_DATA_ACTION.READ_FILE, fileName: reader.fileName, result: e.target.result })
            reader.input.value = ''

        }
        reader.readAsText(event.target.files[0]);
    }
}

const parseFile = () => {
    store.dispatch({ type: APP_DATA_ACTION.PARSE_FILE })
}

const handleDownloadFile = (data, fileName) => {
    fileName = fileName ? fileName : 'gtran07.l5k'
    const blob = new Blob([data], { type: "text/plain;charset=utf-8" })
    saveAs(blob, fileName)
}


export {
    handleOpenFile,
    parseFile,
    handleDownloadFile,
}

