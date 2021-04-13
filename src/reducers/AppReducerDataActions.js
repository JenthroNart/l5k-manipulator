import update from "immutability-helper";
import get from "lodash/get";
import set from "lodash/set";
import forEach from "lodash/forEach";
import findIndex from "lodash/findIndex";
import replace from "lodash/replace";
import keys from "lodash/keys";
import { has } from "lodash";
import { L5K_Component, parseL5K } from "../ultility/L5K";
import { L5X_Component, parseL5X } from "../ultility/L5X";

const APP_DATA_ACTION = {
  READ_MASTER_FILE: "readMasterFile",
  READ_PARTS_FILE: "readPartsFile",
  PARSE_L5K_MASTER: "parseL5KMaster",
  PARSE_L5K_PARTS: "parseL5KParts",
  PARSE_L5X_MASTER: "parseL5XMaster",
  PARSE_L5X_PARTS: "parseL5XParts",
  DELETE_L5K_ITEMS: "deleteL5KItems",
};

const CONTENT_TYPE = {
  Master: "Master",
  Parts: "Parts",
};

const appDataActionHandler = (state, action) => {
  switch (action.type) {
    case APP_DATA_ACTION.READ_MASTER_FILE:
      state = update(state, {
        appFile: {
          inputfileName: { $set: action.fileName },
          inputFile: { $set: action.result },
          outputFileName: { $set: "Gtran07-".concat(action.fileName) },
          outputFile: { $set: action.result },
        },
      });
      return state;

    case APP_DATA_ACTION.READ_PARTS_FILE:
      state = update(state, {
        appFile: {
          partsfileName: { $set: action.fileName },
          partsFile: { $set: action.result },
        },
      });
      return state;

    case APP_DATA_ACTION.PARSE_L5K_MASTER:
      const masterFile = get(state, "appFile.inputFile");
      const parsedMasterFile = parseL5K(masterFile);
      //---------UI management when new data coming in
      if (parsedMasterFile.status === "successful") {
        !has(state, "appUI.dataUI.Master") &&
          set(state, "appUI.dataUI.Master", {});
        state = update(state, {
          appUI: {
            dataUI: { L5KMaster: { $set: parsedMasterFile.parsedData } },
          },
        });
        //Expose selective data to user
        const visibleData = [];
        keys(parsedMasterFile.parsedData).forEach((item) => {
          [
            L5K_Component.Routine,
            L5K_Component.Program,
            L5K_Component.Tag,
            L5K_Component.DataType,
            L5K_Component.AddOnInstruction,
            L5K_Component.Module,
          ].includes(item) && visibleData.push(item);
        });
        state = update(state, {
          appUI: {
            dataUI: { L5KMaster: { visibleData: { $set: visibleData } } },
          },
        });
        if (visibleData.length > 0)
          state = update(state, {
            appUI: {
              activeCollectionPath: { $set: visibleData[0] },
              activeContentType: { $set: "L5KMaster" },
            },
          });
      }
      //raise warning message if passing data fail or set default app UI when new data came in
      else
        state = update(state, {
          appUI: {
            dataUI: { $set: null },
            appDialog: {
              $set: {
                title: "Fail to Read",
                content:
                  parsedMasterFile.message.name +
                  ' in "' +
                  masterFile.fileName +
                  '": ' +
                  parsedMasterFile.message.message,
              },
            },
          },
        });
      return state;

    case APP_DATA_ACTION.PARSE_L5K_PARTS:
      const partsFile = get(state, "appFile.partsFile");
      const parsedPartsFile = parseL5K(partsFile);
      //---------UI management when new data coming in
      if (parsedPartsFile.status === "successful") {
        !has(state, "appUI.dataUI.L5KParts") &&
          set(state, "appUI.dataUI.L5KParts", {});
        state = update(state, {
          appUI: { dataUI: { L5KParts: { $set: parsedPartsFile.parsedData } } },
        });
        //Expose selective data to user
        const visibleParts = [];
        keys(parsedPartsFile.parsedData).forEach((item) => {
          [
            L5K_Component.Routine,
            L5K_Component.Program,
            L5K_Component.Tag,
            L5K_Component.DataType,
            L5K_Component.AddOnInstruction,
          ].includes(item) && visibleParts.push(item);
          state = update(state, {
            appUI: {
              dataUI: { L5KParts: { visibleData: { $set: visibleParts } } },
            },
          });
          if (visibleParts.length > 0)
            state = update(state, {
              appUI: {
                activeCollectionPath: { $set: visibleParts[0] },
                activeContentType: { $set: "L5KParts" },
              },
            });
        });
      }
      //raise warning message if passing data fail or set default app UI when new data came in
      else
        state = update(state, {
          appUI: {
            appDialog: {
              $set: {
                title: "Fail to Read",
                content:
                  parsedPartsFile.message.name +
                  ' in "' +
                  partsFile.fileName +
                  '": ' +
                  parsedPartsFile.message.message,
              },
            },
          },
        });
      return state;

    case APP_DATA_ACTION.PARSE_L5X_MASTER:
      console.log('Processing File....')
      const masterL5XFile = get(state, "appFile.inputFile");
      const parsedL5XMasterFile = parseL5X(masterL5XFile);
      //---------UI management when new data coming in
      if (parsedL5XMasterFile.status === "successful") {
        !has(state, "appUI.dataUI.Master") &&
          set(state, "appUI.dataUI.Master", {});
        // state = update(state, {
        //   appUI: {
        //     dataUI: { L5KMaster: { $set: parsedL5XMasterFile.parsedData } },
        //   },
        // });
        //Expose selective data to user
        const visibleData = [];
        keys(parsedL5XMasterFile.parsedData).forEach((item) => {
          [
            L5X_Component.Routine,
            L5X_Component.Program,
            L5X_Component.Tag,
            L5X_Component.DataType,
            L5X_Component.AddOnInstruction,
            L5X_Component.Module,
          ].includes(item) && visibleData.push(item);
        });
        
      }
      //raise warning message if passing data fail or set default app UI when new data came in
      else
        state = update(state, {
          appUI: {
            dataUI: { $set: null },
            appDialog: {
              $set: {
                title: "Fail to Read",
                content:
                  parsedL5XMasterFile.message.name +
                  ' in "' +
                  masterL5XFile.fileName +
                  '": ' +
                  parsedL5XMasterFile.message.message,
              },
            },
          },
        });
      return state;

    case APP_DATA_ACTION.PARSE_L5X_PARTS:
      return state;

    case APP_DATA_ACTION.DELETE_L5K_ITEMS:
      let resultFile = get(state, "appFile.outputFile");
      forEach(action.data, (item) => {
        const items = get(
          state,
          "appUI.dataUI." +
            state.appUI.activeContentType +
            "." +
            state.appUI.activeCollectionPath +
            ".items"
        );
        const index = findIndex(items, { verbose_name: item.verbose_name });
        const result = update(items, { $splice: [[index, 1]] });
        //Handling UI data
        set(
          state,
          "appUI.dataUI." +
            state.appUI.activeContentType +
            "." +
            state.appUI.activeCollectionPath +
            ".items",
          result
        );
        //Handling the input file
        resultFile = replace(resultFile, item.content, "");
      });
      state = update(state, { appFile: { outputFile: { $set: resultFile } } });
      return state;
    default:
      return state;
  }
};

export { APP_DATA_ACTION, CONTENT_TYPE, appDataActionHandler };
