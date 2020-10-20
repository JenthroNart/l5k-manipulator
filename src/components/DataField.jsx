import React, { memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles(theme => ({
    container: {
        position: "relative"
    },
    label: {
        paddingLeft: '5px',
        paddingRight: '5px',
        color: 'lightgrey',
        position: "absolute",
        top: "-10px",
        left: '5px',
    },
    value: {
        minWidth: props => props.minWidth,
        padding: theme.spacing(1),
        border: "solid 1px grey",
        borderRadius: "4px",
        display: "block",
    }
}));

const DataField = memo(props => {
    const [minWidth, setMinWidth] = React.useState();
    const labelEl = React.useRef(null);
    const classes = useStyles({ minWidth });

    React.useEffect(() => {
        setMinWidth(labelEl.current.clientWidth + 10)
    }, [])

    return (
        <div className={props.className}>
            <div className={classes.container}>
                <Paper elevation={0} className={classes.label} ref={labelEl}>
                    <Typography variant="caption" style={{ whiteSpace: 'nowrap' }}>{props.label}</Typography>
                </Paper>
                <Typography className={classes.value} variant="body1" align="center">
                    {props.value}
                </Typography>
            </div>
        </div >
    );
});

export default DataField;