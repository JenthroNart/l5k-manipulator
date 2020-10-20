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

const getL5K_Component = (input, component) => {
    //extracting components
    const constraints = "\\b".concat(component, "\\b[^]*?\\bEND_", component, "\\b");
    const regex = new RegExp(constraints, "g");
    try {
        return [...input.matchAll(regex)]
    } catch (error) {
        console.log(error)
    }
}

export { L5K, getL5K_Component }