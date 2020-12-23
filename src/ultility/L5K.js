import map from 'lodash/map';
import get from 'lodash/get';

const L5K = {
    Component: {
        Controller: "CONTROLLER",
        DataType: "DATATYPE",
        Routine: "ROUTINE",
        Module: "MODULE",
        Connection: "CONNECTION",
        Tag: "TAG",
        Task: "TAKS",
        FBD_Routine: "FBD_ROUTINE",
        SFC_Routine: "SFC_ROUTINE",
        ST_Routine: "ST_ROUTINE",
        ESQ_Routine: "ESQ_ROUTINE",
        Program: "PROGRAM",
        ChildProgram: "CHILD_PROGRAM",
        Trend: "TREND",
        QuickWatch: "QUICK_WATCH",
        Config: "CONFIG"
    }
}

const getL5K_Components = (input, component) => {
    //extracting components
    const constraints = "\\b".concat(component, "\\b[^]*?\\bEND_", component, "\\b");
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
    const constraints = "(?<=\\b".concat(component, "[\\b\\w\\s]+).+\\b");
    const regex = new RegExp(constraints, "g");
    return get(content.match(regex), '[0]')
}

export { L5K, getL5K_Components }