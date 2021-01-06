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
            parseFile()
        }
        reader.readAsText(event.target.files[0]);
    }
}

const parseFile = () => {
    store.dispatch({ type: APP_DATA_ACTION.PARSE_FILE })
}

const handleDownloadFile = (appFile, fileName) => {
    fileName = fileName ? fileName : appFile.outputFileName
    const blob = new Blob([appFile.outputFile], { type: "text/plain;charset=utf-8" })
    saveAs(blob, fileName)
}


export {
    handleOpenFile,
    parseFile,
    handleDownloadFile,
}

