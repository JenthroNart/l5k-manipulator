import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import MenuItem from '@material-ui/core/MenuItem';
import PaletteIcon from '@material-ui/icons/Palette';

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        display: "flex",
        justifyContent: props => props.justifyContent
    },
    button: {

    }
}));

const ColorIcon = props => {
    const classes = useStyles();
    return (
        <Paper className={props.className}>
            <MenuItem className={classes.root} selected={props.selected} dense disableGutters onClick={props.onClick}>
                <PaletteIcon style={{ color: props.color }} fontSize="large" />
                {props.onDelete ? <IconButton className={classes.button} color="secondary" onClick={props.onDelete} size="small" >
                    <DeleteIcon fontSize="small" />
                </IconButton>
                    : null}
            </MenuItem>
        </Paper>
    )
};

export default ColorIcon