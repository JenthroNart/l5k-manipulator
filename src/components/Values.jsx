import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Collapsible from "./Collapsible";
import TextField from '@material-ui/core/TextField';
import ColorSelection from "./ColorSelection";
import { validateItem } from '../ultility/dataValidation';
import get from 'lodash/get';
import set from 'lodash/set';
import clone from 'lodash/clone';
import map from 'lodash/map';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(1)
  },
  content: {
    padding: theme.spacing(2),
    paddingTop: 0,
  },
  textField: {
    marginTop: theme.spacing(1)
  }
}));


const Values = props => {
  const classes = useStyles()
  const [values, setValues] = useState()
  const [validatedData, setValidatedData] = useState()
  const [validation, setValidation] = useState()

  //init Local Data
  useEffect(() => {
    setValues(props.selectedObject)
  }, [props.selectedObject])

  //Data Validation
  useEffect(() => {
    const { validatedData, validation } = validateItem(props.model, values, props.collection.data)
    setValidatedData(validatedData)
    setValidation(validation)
  }, [values, props.model, props.collection])

  const handleValueChange = (event, itemKey) => {
    const clonedValues = clone(values)
    set(clonedValues, itemKey, event.target.value)
    setValues(clonedValues)
  }

  const handleKeyPressed = (event, itemKey) => {
    switch (event.key) {
      case "Enter":
        if (get(validation, itemKey)) {
          props.updateValues({ [itemKey]: get(validatedData, itemKey) })
          event.target.blur()
        }
        break;
      case "Escape":
        event.target.blur()
        break;
      default:
    }
  }

  const handleClickAway = () => {
    setValues(props.selectedObject)
  }

  if (!props.selectedObject) return null;
  const model = props.model ? props.model : props.selectedObject
  return (
    <Collapsible {...props}>
      <div className={classes.content}>
        {map(model, (item, key) => {
          let value = get(values, key)
          value = value ? value : ''
          return <TextField
            disabled={get(model, [key, 'data_type']) === 'derived'}
            size="small" variant="outlined" fullWidth key={key}
            error={!get(validation, key)}
            label={item.verbose_name ? item.verbose_name : key}
            value={value}
            className={classes.textField}
            onChange={e => handleValueChange(e, key)}
            onKeyDown={e => handleKeyPressed(e, key)}
            onBlur={e => handleClickAway(e, key)} />

        }
        )}
        <ColorSelection
          colorList={props.colorList}
          selectedObject={props.selectedObject}
          onSelectionChange={handleValueChange} />
      </div>
    </Collapsible>
  )
}
export default Values;