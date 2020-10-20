import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SketchPicker } from 'react-color';
import ColorIcon from './ColorIcon';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Collapsible from "./Collapsible";
import Typography from '@material-ui/core/Typography';
import { Paper } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Button from '@material-ui/core/Button';
import get from 'lodash/get';
import has from 'lodash/has';
import compact from 'lodash/compact';


const useStyles = makeStyles(theme => ({
  content: {
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(2),
    paddingTop: 0,
  },
  button: {
    marginRight: theme.spacing(1),
  },
  colorIcon: {
    margin: theme.spacing(1),
  },
  propertiesContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "30%",
    marginLeft: theme.spacing(1),

  },
  property: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },

}));


const Graphic = props => {
  const classes = useStyles()
  const [pickerColor, setPickerColor] = useState();
  const [foregroundSelected, setForegroundSelected] = useState(null);
  const [maxBackgroundColor, setMaxBackgroundColor] = useState(10);
  const [backgroundColorIndex, setBackgroundColorIndex] = useState(null);
  const [foreground, setForeground] = useState();
  const [background, setBackground] = useState([]);

  React.useEffect(() => {
    if (props.selectedObject) {
      setForeground(get(props, 'selectedObject.foreground'))
      let bg = get(props, 'selectedObject.background')
      bg = bg ? bg : get(props, 'selectedObject.color')
      bg = Array.isArray(bg) ? bg : [bg]
      bg = compact(bg)
      setBackground(bg);
      let maxBGCount = props.maxBackgroundColor ? props.maxBackgroundColor : 10
      maxBGCount = get(props, 'model.background.data_type') === 'string' ? 1 : maxBGCount;
      setMaxBackgroundColor(maxBGCount)
    }
  }, [props])

  const handleColorPickerChange = color => {
    setPickerColor(get(color, 'hex'))
    if (foregroundSelected) {
      setForeground(get(color, 'hex'))
    }
    else if (background[backgroundColorIndex]) {
      const newArray = [...background]
      newArray[backgroundColorIndex] = get(color, 'hex')
      setBackground(newArray)
    }
  };

  const handleForegroundSelect = (color) => {
    setForegroundSelected(true);
    setBackgroundColorIndex(null);
    setPickerColor(foreground);
  };

  const handleBackgroundSelect = (color, index) => {
    setPickerColor(color)
    setForegroundSelected(null);
    setBackgroundColorIndex(index)
  }

  const handleClickAway = () => {
    setForegroundSelected(null);
    setBackgroundColorIndex(null);
  }

  const handleBackgroundColorDelete = data => {
    setBackground(background.filter((color, index) => data !== index));
  }

  const handleBackgroundColorAdd = () => {
    setBackground([...background, pickerColor])
  }

  const handleUpdateGrahic = () => {
    const bgValues = get(props, 'model.background.data_type') === 'string' && background.length > 0 ? background[0].toString() : background
    props.updateGraphic({ foreground, background: bgValues })
  }

  if (props.selectedObject &&
    (has(props.model, 'foreground') ||
      has(props.model, 'background') ||
      has(props.model, 'color') ||
      has(props.selectedObject, 'foreground') ||
      has(props.selectedObject, 'background') ||
      has(props.selectedObject, 'color'))) {
    return (
      <Collapsible {...props}>
        <ClickAwayListener onClickAway={handleClickAway}>
          <div className={classes.content}>
            <SketchPicker disableAlpha color={pickerColor} onChange={handleColorPickerChange} />
            <div className={classes.propertiesContainer}>
              {get(props, 'model.foreground') ? <Paper className={classes.property}>
                <Typography variant="caption">Foreground</Typography>
                <ColorIcon
                  color={foreground}
                  selected={foregroundSelected}
                  className={classes.colorIcon}
                  onClick={handleForegroundSelect}
                  justifyContent="center" />
              </Paper> : null}
              {get(props, 'model.background') || get(props, 'model.color') ?
                <Paper className={classes.property}>
                  <Typography variant="caption">Background</Typography>
                  {Array.isArray(background) && background.length < maxBackgroundColor ?
                    <IconButton onClick={handleBackgroundColorAdd} style={{ color: "green" }}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                    : null}
                  <div style={{ width: "100%" }}>
                    {background.map((color, index) =>
                      <ColorIcon
                        key={index}
                        color={color}
                        selected={index === backgroundColorIndex}
                        className={classes.colorIcon}
                        justifyContent="space-between"
                        onDelete={() => handleBackgroundColorDelete(index)}
                        onClick={() => handleBackgroundSelect(color, index)} />
                    )}
                  </div>
                </Paper> : null}
              <Button variant="contained" onClick={handleUpdateGrahic}>Apply</Button>
            </div>
          </div>
        </ClickAwayListener>
      </Collapsible >
    )
  } else return null

}

export default Graphic;
