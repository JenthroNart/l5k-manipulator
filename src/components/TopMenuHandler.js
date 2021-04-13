import { store } from "../App";
import { saveAs } from "file-saver";
import toUpper from "lodash/toUpper";
import {
  APP_DATA_ACTION,
  CONTENT_TYPE,
} from "../reducers/AppReducerDataActions";

const handleOpenFile = (event, type) => {
  if (event.target.files && event.target.files.length > 0) {
    const reader = new FileReader();
    reader.input = event.target;
    reader.fileName = event.target.files[0].name;
    reader.fileExtension = reader.fileName.split(".").pop();
    reader.contentType = type;
    reader.onload = (e) => {
      switch (reader.contentType) {
        case CONTENT_TYPE.Master:
          store.dispatch({
            type: APP_DATA_ACTION.READ_MASTER_FILE,
            fileName: reader.fileName,
            result: e.target.result,
          });
          reader.input.value = "";
          switch (toUpper(reader.fileExtension)) {
            case "L5K":
              store.dispatch({ type: APP_DATA_ACTION.PARSE_L5K_MASTER });
              break;
            case "L5X":
              store.dispatch({ type: APP_DATA_ACTION.PARSE_L5X_MASTER });
              break;
            default:
          }
          break;
        case CONTENT_TYPE.Parts:
          store.dispatch({
            type: APP_DATA_ACTION.READ_PARTS_FILE,
            fileName: reader.fileName,
            result: e.target.result,
          });
          reader.input.value = "";
          switch (toUpper(reader.fileExtension)) {
            case "L5K":
              store.dispatch({ type: APP_DATA_ACTION.PARSE_L5K_PARTS });
              break;
            case "L5X":
              store.dispatch({ type: APP_DATA_ACTION.PARSE_L5X_PARTS });
              break;
            default:
          }

          break;
        default:
      }
    };
    reader.readAsText(event.target.files[0]);
  }
};

const handleDownloadFile = (appFile, fileName) => {
  fileName = fileName ? fileName : appFile.outputFileName;
  const blob = new Blob([appFile.outputFile], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, fileName);
};

const connectPLC = () => {
  console.log("connecting...");

};

export { handleOpenFile, handleDownloadFile, connectPLC };
