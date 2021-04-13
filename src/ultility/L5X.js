import map from 'lodash/map';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import replace from 'lodash/replace';
import keys from 'lodash/keys';
import set from 'lodash/set';
import concat from 'lodash/concat';
import XMLParser from 'react-xml-parser';

const L5X_Component = {
    Content: 'RSLogix5000Content',
    Controller: "Controller",
    DataType: "DataType",
    Module: "Module",
    AddOnInstruction: "AddOnInstructionDefinition",
    Tag: "Tag",
    Program: "Program",
    Routine: "Routine",
    Task: "Task",
    ParameterConnection: "ParameterConnetion",
    Trend: "Trend",
    QuickWatchLists: "QuickWatchList",
    CommPorts: "CommPort",
    CST: "CST",
    WallClockTime: "WallClockTime"
}

const parseL5X = input => {
    let parsedData = {}, status = 'fail', message = '', parsedInput = ''
    try {
        //conditioning input L5X Text
        parsedInput = String(input)
        //get programs
        set(parsedData, [L5X_Component.Program, 'items'], getL5X_Component(parsedInput, L5X_Component.Program))
        parsedData[L5X_Component.Program]['verbose_name'] = 'Programs'
        parsedInput = removeComponents(parsedData[L5X_Component.Program], parsedInput)
        //const parsedPrograms = map(parsedData[L5X_Component.Program].items, program => Object.assign(program, parseL5XProgram(program.content)))
        //parsedData[L5X_Component.Program].items = parsedPrograms

        // //get Add On Instructions
        // set(parsedData, [L5X_Component.AddOnInstruction, 'items'], getL5X_Component(parsedInput, L5X_Component.AddOnInstruction))
        // parsedInput = removeComponents(parsedData[L5X_Component.AddOnInstruction], parsedInput)
        // parsedData[L5X_Component.AddOnInstruction]['verbose_name'] = 'AOI'


        // //get Modules
        // set(parsedData, [L5X_Component.Module, 'items'], getL5X_Component(parsedInput, L5X_Component.Module))
        // parsedData[L5X_Component.Module]['verbose_name'] = 'Modules'
        // parsedInput = removeComponents(parsedData[L5X_Component.Module], parsedInput)


        // //get Tasks
        // set(parsedData, [L5X_Component.Task, 'items'], getL5X_Component(parsedInput, L5X_Component.Task))
        // parsedData[L5X_Component.Task]['verbose_name'] = 'Tasks'
        // parsedInput = removeComponents(parsedData[L5X_Component.Task], parsedInput)


        // //get Configs
        // set(parsedData, [L5X_Component.Config, 'items'], getL5X_Component(parsedInput, L5X_Component.Config))
        // parsedData[L5X_Component.Config]['verbose_name'] = 'Configuration'
        // parsedInput = removeComponents(parsedData[L5X_Component.Config], parsedInput)


        // //get Trends
        // set(parsedData, [L5X_Component.Trend, 'items'], getL5X_Component(parsedInput, L5X_Component.Trend))
        // parsedData[L5X_Component.Trend]['verbose_name'] = 'Trends'
        // parsedInput = removeComponents(parsedData[L5X_Component.Trend], parsedInput)


        // //get Quick Watches
        // set(parsedData, [L5X_Component.QuickWatch, 'items'], getL5X_Component(parsedInput, L5X_Component.QuickWatch))
        // parsedData[L5X_Component.QuickWatch]['verbose_name'] = 'Quick Watches'
        // parsedInput = removeComponents(parsedData[L5X_Component.QuickWatch], parsedInput)


        // //get data types
        // set(parsedData, [L5X_Component.DataType, 'items'], getL5X_Component(parsedInput, L5X_Component.DataType))
        // parsedData[L5X_Component.DataType]['verbose_name'] = 'UDT'
        // parsedInput = removeComponents(parsedData[L5X_Component.DataType], parsedInput)


        // //get controller Scope Tags
        // set(parsedData, [L5X_Component.Tag, 'items'], getL5X_Component(parsedInput, L5X_Component.Tag))
        // parsedData[L5X_Component.Tag]['verbose_name'] = 'Controller Tags'
        // parsedInput = removeComponents(parsedData[L5X_Component.Tag], parsedInput)
        // // if (parsedData[L5X_Component.Tag].items.length > 0) {
        // //     parsedData[L5X_Component.Tag].items = parseTagComponent(parsedData[L5X_Component.Tag].items[0].content)
        // // }

        // //get Controller Info
        // set(parsedData, [L5X_Component.Controller, 'items'], getL5X_Component(parsedInput, L5X_Component.Controller))
        // parsedInput = removeComponents(parsedData[L5X_Component.Controller], parsedInput)
        // //get Routines

        // set(parsedData, [L5X_Component.Routine, 'items'], getL5X_Component(parsedInput, L5X_Component.Routine))
        // parsedData[L5X_Component.Routine]['verbose_name'] = 'Routines'
        // parsedInput = removeComponents(parsedData[L5X_Component.Routine], parsedInput)

        // //get FBD Routines
        // set(parsedData, [L5X_Component.FBD_Routine, 'items'], getL5X_Component(parsedInput, L5X_Component.FBD_Routine))
        // parsedData[L5X_Component.FBD_Routine]['verbose_name'] = 'FBD'
        // parsedInput = removeComponents(parsedData[L5X_Component.FBD_Routine], parsedInput)

        // //get ST Routines
        // set(parsedData, [L5X_Component.ST_Routine, 'items'], getL5X_Component(parsedInput, L5X_Component.ST_Routine))
        // parsedData[L5X_Component.ST_Routine]['verbose_name'] = 'ST'
        // parsedInput = removeComponents(parsedData[L5X_Component.ST_Routine], parsedInput)

        // //get SFC Routines
        // set(parsedData, [L5X_Component.SFC_Routine, 'items'], getL5X_Component(parsedInput, L5X_Component.SFC_Routine))
        // parsedData[L5X_Component.SFC_Routine]['verbose_name'] = 'SFC'
        // parsedInput = removeComponents(parsedData[L5X_Component.SFC_Routine], parsedInput)

        // //Clearning Up empty data
        // keys(parsedData).forEach(key => parsedData[key].items.length < 1 && delete parsedData[key])
        status = 'successful'
    } catch (e) {
        parsedData = {}
        status = 'fail'
        message = e
    }

    return { parsedData, parsedInput, status, message };
}

const parseL5XProgram = L5XProgramContent => {
    let parsedData = {}
    let parsedInput = String(L5XProgramContent)
    //get Program Scope Tags
    let parsedResult = getL5X_Component(parsedInput, L5X_Component.Tag)
    parsedInput = removeComponents(parsedResult, parsedInput)
    if (parsedResult.length > 0) {
        parsedData.items = parseTagComponent(parsedResult[0].content)
    }

    //get Routines
    parsedResult = getL5X_Component(parsedInput, L5X_Component.Routine)
    parsedInput = removeComponents(parsedResult, parsedInput)
    parsedData.items = concat(parsedData.items, parsedResult)

    //get FBD Routines
    parsedResult = getL5X_Component(parsedInput, L5X_Component.FBD_Routine)
    parsedInput = removeComponents(parsedResult, parsedInput)
    parsedData.items = concat(parsedData.items, parsedResult)

    //get ST Routines
    parsedResult = getL5X_Component(parsedInput, L5X_Component.ST_Routine)
    parsedInput = removeComponents(parsedResult, parsedInput)
    parsedData.items = concat(parsedData.items, parsedResult)

    //get SFC Routines
    parsedResult = getL5X_Component(parsedInput, L5X_Component.SFC_Routine)
    parsedInput = removeComponents(parsedResult, parsedInput)
    parsedData.items = concat(parsedData.items, parsedResult)

    //get Child Programs
    parsedResult = getL5X_Component(parsedInput, L5X_Component.ChildProgram)
    parsedInput = removeComponents(parsedResult, parsedInput)
    parsedData.items = concat(parsedData.items, parsedResult)

    return parsedData
}

const parseTagComponent = L5XContent => {
    //extract tag content
    let regex = new RegExp('(?<=TAG[\\n\\s])[^]*?(?=[\\n\\s]END_TAG)', 'g');
    const inputContent = [...L5XContent.matchAll(regex)]
    try {
        //extracting individual tag
        regex = new RegExp('\\s*(\\b\\w+\\b)[^]*?\\;', 'g');
        const result = [...inputContent[0][0].matchAll(regex)]
        return map(result, tag => {
            return {
                verbose_name: tag[1],
                type: 'TAG',
                content: tag[0]
            }
        })
    } catch (error) {
        console.log(error)
        return []
    }

}

const removeComponents = (component, L5XContent) => {
    let result = L5XContent;

    forEach(component.items, item => {
        result = replace(result, item.content, '')
    })
    return result
}

const getL5X_Component = (input, component) => {
    //extracting components
    const constraints = "<" + component + "\\b[^]*?>[^]*?</" + component + ">";
    const regex = new RegExp(constraints, "g");
    try {
        const result = [...input.matchAll(regex)]
        return map(result, item => {
            const handle = getComponentName(component, item[0])
            return {
                verbose_name: handle,
                type: component,
                content: get(item, "[0]")
            }
        })
    } catch (error) {
        console.log(error)
    }
}

const getComponentName = (component, content) => {
    const constraints = "(?<=\\s*" + component + "\\s+)\\w+";
    const regex = new RegExp(constraints, "g");
    return get(content.match(regex), '[0]')
}

export {
    L5X_Component,
    parseL5X,
    parseL5XProgram
}