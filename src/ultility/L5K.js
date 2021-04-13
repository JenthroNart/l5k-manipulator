import map from "lodash/map";
import get from "lodash/get";
import forEach from "lodash/forEach";
import replace from "lodash/replace";
import keys from "lodash/keys";
import set from "lodash/set";
import concat from "lodash/concat";

const L5K_Component = {
  Controller: "CONTROLLER",
  DataType: "DATATYPE",
  Module: "MODULE",
  AddOnInstruction: "ADD_ON_INSTRUCTION_DEFINITION",
  Tag: "TAG",
  Program: "PROGRAM",
  Routine: "ROUTINE",
  FBD_Routine: "FBD_ROUTINE",
  SFC_Routine: "SFC_ROUTINE",
  ST_Routine: "ST_ROUTINE",
  Task: "TASK",
  ParameterConnection: "PARAMETER_CONNECTION",
  Trend: "TREND",
  QuickWatch: "QUICK_WATCH",
  Config: "CONFIG",
  ChildProgram: "CHILD_PROGRAMS",
  Encoded_Data: "ENCODED_DATA",
};

const parseL5K = (input) => {
  let parsedData = {},
    status = "fail",
    message = "",
    parsedInput = "";
  try {
    //conditioning input L5K Text
    parsedInput = String(input);
    //get programs
    set(
      parsedData,
      [L5K_Component.Program, "items"],
      getL5K_Component(parsedInput, L5K_Component.Program)
    );
    parsedData[L5K_Component.Program]["verbose_name"] = "Programs";
    parsedInput = removeComponents(
      parsedData[L5K_Component.Program],
      parsedInput
    );
    const parsedPrograms = map(
      parsedData[L5K_Component.Program].items,
      (program) => Object.assign(program, parseL5KProgram(program.content))
    );
    parsedData[L5K_Component.Program].items = parsedPrograms;

    //get Add On Instructions
    set(
      parsedData,
      [L5K_Component.Encoded_Data, "items"],
      getL5K_Component(parsedInput, L5K_Component.Encoded_Data)
    );
    parsedInput = removeComponents(
      parsedData[L5K_Component.Encoded_Data],
      parsedInput
    );
    parsedData[L5K_Component.Encoded_Data]["verbose_name"] = "Encoded Component";

    //get Add On Instructions
    set(
      parsedData,
      [L5K_Component.AddOnInstruction, "items"],
      getL5K_Component(parsedInput, L5K_Component.AddOnInstruction)
    );
    parsedInput = removeComponents(
      parsedData[L5K_Component.AddOnInstruction],
      parsedInput
    );
    parsedData[L5K_Component.AddOnInstruction]["verbose_name"] = "AOI";

    //get Modules
    set(
      parsedData,
      [L5K_Component.Module, "items"],
      getL5K_Component(parsedInput, L5K_Component.Module)
    );
    parsedData[L5K_Component.Module]["verbose_name"] = "Modules";
    parsedInput = removeComponents(
      parsedData[L5K_Component.Module],
      parsedInput
    );

    //get Tasks
    set(
      parsedData,
      [L5K_Component.Task, "items"],
      getL5K_Component(parsedInput, L5K_Component.Task)
    );
    parsedData[L5K_Component.Task]["verbose_name"] = "Tasks";
    parsedInput = removeComponents(parsedData[L5K_Component.Task], parsedInput);

    //get Configs
    set(
      parsedData,
      [L5K_Component.Config, "items"],
      getL5K_Component(parsedInput, L5K_Component.Config)
    );
    parsedData[L5K_Component.Config]["verbose_name"] = "Configuration";
    parsedInput = removeComponents(
      parsedData[L5K_Component.Config],
      parsedInput
    );

    //get Trends
    set(
      parsedData,
      [L5K_Component.Trend, "items"],
      getL5K_Component(parsedInput, L5K_Component.Trend)
    );
    parsedData[L5K_Component.Trend]["verbose_name"] = "Trends";
    parsedInput = removeComponents(
      parsedData[L5K_Component.Trend],
      parsedInput
    );

    //get Quick Watches
    set(
      parsedData,
      [L5K_Component.QuickWatch, "items"],
      getL5K_Component(parsedInput, L5K_Component.QuickWatch)
    );
    parsedData[L5K_Component.QuickWatch]["verbose_name"] = "Quick Watches";
    parsedInput = removeComponents(
      parsedData[L5K_Component.QuickWatch],
      parsedInput
    );

    //get data types
    set(
      parsedData,
      [L5K_Component.DataType, "items"],
      getL5K_Component(parsedInput, L5K_Component.DataType)
    );
    parsedData[L5K_Component.DataType]["verbose_name"] = "UDT";
    parsedInput = removeComponents(
      parsedData[L5K_Component.DataType],
      parsedInput
    );

    //get controller Scope Tags
    set(
      parsedData,
      [L5K_Component.Tag, "items"],
      getL5K_Component(parsedInput, L5K_Component.Tag)
    );
    parsedData[L5K_Component.Tag]["verbose_name"] = "Controller Tags";
    parsedInput = removeComponents(parsedData[L5K_Component.Tag], parsedInput);
    if (parsedData[L5K_Component.Tag].items.length > 0) {
      parsedData[L5K_Component.Tag].items = parseTagComponent(
        parsedData[L5K_Component.Tag].items[0].content
      );
    }

    //get Controller Info
    set(
      parsedData,
      [L5K_Component.Controller, "items"],
      getL5K_Component(parsedInput, L5K_Component.Controller)
    );
    parsedInput = removeComponents(
      parsedData[L5K_Component.Controller],
      parsedInput
    );
    //get Routines

    set(
      parsedData,
      [L5K_Component.Routine, "items"],
      getL5K_Component(parsedInput, L5K_Component.Routine)
    );
    parsedData[L5K_Component.Routine]["verbose_name"] = "Routines";
    parsedInput = removeComponents(
      parsedData[L5K_Component.Routine],
      parsedInput
    );

    //get FBD Routines
    set(
      parsedData,
      [L5K_Component.FBD_Routine, "items"],
      getL5K_Component(parsedInput, L5K_Component.FBD_Routine)
    );
    parsedData[L5K_Component.FBD_Routine]["verbose_name"] = "FBD";
    parsedInput = removeComponents(
      parsedData[L5K_Component.FBD_Routine],
      parsedInput
    );

    //get ST Routines
    set(
      parsedData,
      [L5K_Component.ST_Routine, "items"],
      getL5K_Component(parsedInput, L5K_Component.ST_Routine)
    );
    parsedData[L5K_Component.ST_Routine]["verbose_name"] = "ST";
    parsedInput = removeComponents(
      parsedData[L5K_Component.ST_Routine],
      parsedInput
    );

    //get SFC Routines
    set(
      parsedData,
      [L5K_Component.SFC_Routine, "items"],
      getL5K_Component(parsedInput, L5K_Component.SFC_Routine)
    );
    parsedData[L5K_Component.SFC_Routine]["verbose_name"] = "SFC";
    parsedInput = removeComponents(
      parsedData[L5K_Component.SFC_Routine],
      parsedInput
    );

    //Clearning Up empty data
    keys(parsedData).forEach(
      (key) => parsedData[key].items.length < 1 && delete parsedData[key]
    );
    status = "successful";
  } catch (e) {
    parsedData = {};
    status = "fail";
    message = e;
  }

  return { parsedData, parsedInput, status, message };
};

const parseL5KProgram = (L5KProgramContent) => {
  let parsedData = {};
  let parsedInput = String(L5KProgramContent);
  //get Program Scope Tags
  let parsedResult = getL5K_Component(parsedInput, L5K_Component.Tag);
  parsedInput = removeComponents(parsedResult, parsedInput);
  if (parsedResult.length > 0) {
    parsedData.items = parseTagComponent(parsedResult[0].content);
  }

  //get Routines
  parsedResult = getL5K_Component(parsedInput, L5K_Component.Routine);
  parsedInput = removeComponents(parsedResult, parsedInput);
  parsedData.items = concat(parsedData.items, parsedResult);

  //get FBD Routines
  parsedResult = getL5K_Component(parsedInput, L5K_Component.FBD_Routine);
  parsedInput = removeComponents(parsedResult, parsedInput);
  parsedData.items = concat(parsedData.items, parsedResult);

  //get ST Routines
  parsedResult = getL5K_Component(parsedInput, L5K_Component.ST_Routine);
  parsedInput = removeComponents(parsedResult, parsedInput);
  parsedData.items = concat(parsedData.items, parsedResult);

  //get SFC Routines
  parsedResult = getL5K_Component(parsedInput, L5K_Component.SFC_Routine);
  parsedInput = removeComponents(parsedResult, parsedInput);
  parsedData.items = concat(parsedData.items, parsedResult);

  //get Child Programs
  parsedResult = getL5K_Component(parsedInput, L5K_Component.ChildProgram);
  parsedInput = removeComponents(parsedResult, parsedInput);
  parsedData.items = concat(parsedData.items, parsedResult);

  return parsedData;
};

const parseTagComponent = (L5KContent) => {
  //extract tag content
  let regex = new RegExp("(?<=TAG[\\n\\s])[^]*?(?=[\\n\\s]END_TAG)", "g");
  const inputContent = [...L5KContent.matchAll(regex)];
  try {
    //extracting individual tag
    regex = new RegExp("\\s*(\\b\\w+\\b)[^]*?\\;", "g");
    const result = [...inputContent[0][0].matchAll(regex)];
    return map(result, (tag) => {
      return {
        verbose_name: tag[1],
        type: "TAG",
        content: tag[0],
      };
    });
  } catch (error) {
    console.log(error);
    return [];
  }
};

const removeComponents = (component, L5KContent) => {
  let result = L5KContent;

  forEach(component.items, (item) => {
    result = replace(result, item.content, "");
  });
  return result;
};

const getL5K_Component = (input, component) => {
  //extracting components
  const constraints =
    "[\\s\\b]+" + component + "[^]*?[\\s\\b]+END_" + component + "[\\s\\b]";
  const regex = new RegExp(constraints, "g");
  try {
    const result = [...input.matchAll(regex)];
    return map(result, (item) => {
      const handle = getComponentName(component, item[0]);
      return {
        verbose_name: handle,
        type: component,
        content: get(item, "[0]"),
      };
    });
  } catch (error) {
    console.log(error);
  }
};

const getComponentName = (component, content) => {
  const constraints = "(?<=\\s*" + component + "\\s+)\\w+";
  const regex = new RegExp(constraints, "g");
  return get(content.match(regex), "[0]");
};

export { L5K_Component, parseL5K, parseL5KProgram };
