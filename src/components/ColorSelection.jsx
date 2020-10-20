import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import GraphicIcon from './GraphicIcon';
import { Typography } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextFieldsIcon from '@material-ui/icons/TextFields';


const useStyles = makeStyles(theme => ({
  selection: {
    marginTop: theme.spacing(1)
  },
  option: {
    display: "flex",
    alignItems: "center",
  },
  optionCaption: {
    marginLeft: theme.spacing(2),
  },
}));


const ColorSelection = props => {
  const classes = useStyles()
  
  if (!props.colorList) return null;
  let selectionValue = props.colorList.filter(color => color.constant === props.selectedObject.color_constant)
  selectionValue = selectionValue.length > 0 ? selectionValue[0].constant : -1
  return (
    <FormControl variant="outlined" fullWidth className={classes.selection} size="small">
      <InputLabel>Color Options</InputLabel>
      <Select
        value={selectionValue}
        onChange={props.onSelectionChange}
        fullWidth
        className={classes.selection}
        label="Color Options"
      >
        <MenuItem value={-1} >
          <Typography variant="caption" className={classes.optionCaption}>{props.selectedObject.color_constant} - unknown</Typography>
        </MenuItem>
        {props.colorList.map((color, index) =>
          <MenuItem key={index} value={color.constant}>
            <div className={classes.option}>
              <GraphicIcon background={color.background} foreground={color.foreground} width={40} height={40} icon={<TextFieldsIcon />} />
              <Typography variant="caption" className={classes.optionCaption} noWrap>{color.constant} - {color.verbose_name}</Typography>
            </div>
          </MenuItem>)}
      </Select>
    </FormControl>
  )
}

export default ColorSelection;