import React, { useState, useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Collapsible from "./Collapsible";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import update from 'immutability-helper';
import { APP_DATA_TYPE } from '../reducers/AppReducerDataActions';
import { map, set, get, filter, has, clone } from 'lodash';
import snakeCase from 'lodash/snakeCase';
import keys from 'lodash/keys';
import Paper from '@material-ui/core/Paper';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';


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
  },
  option: {
    marginTop: theme.spacing(1)
  },
  newKeyForm: {
    display: 'flex',
    padding: theme.spacing(1),
  },
  subFields: {
    paddingLeft: theme.spacing(1)
  }
}));


const DataListModel = props => {
  const classes = useStyles()
  const [localModel, setLocalModel] = useState({})
  const [newKeyName, setNewKeyName] = useState('')
  const [keyNameError, setKeyNameError] = useState(false)
  const [selectedForDelete, setSelectedForDelete] = useState()

  useEffect(() => {
    console.log(props.activeCollection.model)
    props.activeCollection.model && setLocalModel(props.activeCollection.model)
    !props.activeCollection.model && setLocalModel({})
    setSelectedForDelete(keys(props.activeCollection.model)[0])
  }, [props.activeCollection.model])

  //Adding new Key to model
  const handleNewKeyNameChange = e => {
    setNewKeyName(e.target.value)
    if (e.target.value.length < 1 || keys(localModel).includes(snakeCase(e.target.value))) setKeyNameError(true)
    else setKeyNameError(false)
  };

  const handleAddNewKey = () => {
    if (newKeyName.length > 0 && !keyNameError) {
      const key = snakeCase(newKeyName)
      set(localModel, [key, 'verbose_name'], null)
      const newModel = update(localModel, { [key]: { verbose_name: { $set: newKeyName } } })
      setLocalModel(newModel)
      props.updateModel({ [key]: newModel[key] })
      setNewKeyName('')
      setKeyNameError(false)
    }
    else setKeyNameError(true)
  };

  const handleNewKeyNameKeyPressed = event => {
    switch (event.key) {
      case "Enter":
        handleAddNewKey()
        event.target.blur()
        break;
      case "Escape":
        setNewKeyName('')
        setKeyNameError(false)
        event.target.blur()
        break;
      default:
    }
  }

  //Removing existing Key from model
  const selectForDeleteChange = e => {
    setSelectedForDelete(e.target.value)
  }

  const handleRemoveKey = () => {
    const newModel = update(localModel, { $unset: [selectedForDelete] })
    setLocalModel(newModel)
    props.deleteCollectionModelKey({ key: selectedForDelete })
  }

  //model key data type 
  const handleDatatypeChange = (event, key) => {
    const newModel = update(localModel, { [key]: { data_type: { $set: event.target.value } } })
    setLocalModel(newModel)
    props.updateModel({ [key]: newModel[key] })
  }

  //update logic for derived data type
  const handleLogicChange = (event, key) => {
    setLocalModel(update(localModel, { [key]: { evaluation_logic: { $set: event.target.value } } }))
  }

  const handleModelUpdateKeyPressed = (event, key) => {
    switch (event.key) {
      case "Enter":
        props.updateModel({ [key]: localModel[key] })
        event.target.blur()
        break;
      case "Escape":
        cancelModelChanges()
        event.target.blur()
        break;
      default:
    }
  }

  //handling model key with data type relational
  const handleForeignKeyChange = (event, key, attribute) => {
    let newModel = clone(localModel)
    !has(newModel, [key, 'foreignKey', attribute]) && set(newModel, [key, 'foreignKey', attribute])
    newModel = update(newModel, { [key]: { foreignKey: { [attribute]: { $set: event.target.value } } } })
    setLocalModel(newModel)
    props.updateModel({ [key]: newModel[key] })
  }

  //model wide changes revert
  const cancelModelChanges = () => {
    setLocalModel(get(props, 'activeCollection.model'))
  }


  if (!props.activeCollection) return null
  return (
    <Collapsible {...props}>
      <div className={classes.content}>
        <Paper >
          {
            //Adding New Key to Model
          }
          <div className={classes.newKeyForm}>
            <TextField label="New Key Name" variant="outlined" size="small" fullWidth value={newKeyName} error={keyNameError}
              onChange={handleNewKeyNameChange} onKeyPress={handleNewKeyNameKeyPressed} />
            <Tooltip title='Create'>
              <IconButton className={classes.button} onClick={handleAddNewKey} >
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
          </div>
          {
            //Removing Existing Key from model
          }
          {keys(localModel).length > 0 ? <div className={classes.newKeyForm}>
            <FormControl variant="outlined" fullWidth size="small">
              <InputLabel>Model Key</InputLabel>
              <Select label='Model Key' fullWidth
                value={selectedForDelete ? selectedForDelete : -1}
                onChange={selectForDeleteChange}>
                <em values={-1}></em>
                {map(localModel, (item, key) => <MenuItem key={key} value={key}>{key}</MenuItem>)}
              </Select>
            </FormControl>
            <Tooltip title='Remove'>
              <IconButton className={classes.button} onClick={handleRemoveKey} >
                <RemoveCircleIcon />
              </IconButton>
            </Tooltip>
          </div> : null}
        </Paper>
        {map(localModel, (item, key) => {
          let foreignModel = filter(props.appData, (foreignCollections, foreignCollectionKeys) => foreignCollectionKeys === get(item, 'foreignKey.model'))[0]
          foreignModel = foreignModel ? foreignModel.model : undefined
          const foreignKeyValue = get(localModel, [key, 'foreignKey', 'model']) ? get(localModel, [key, 'foreignKey', 'model']) : 'unknown'
          const dataType = localModel[key].data_type ? localModel[key].data_type : 'unknown'
          return < Fragment key={key} >
            {
              //Main Model Fields and their Data Type
            }
            <FormControl variant="outlined" fullWidth size="small" className={classes.option} error={dataType === 'unknown'}>
              <InputLabel>"item.{key}" Data Type</InputLabel>
              <Select value={dataType}
                label={"item.\"" + key + "\" Data Type"}
                onChange={event => handleDatatypeChange(event, key)}
                fullWidth>
                <MenuItem value="unknown">Unknown</MenuItem>
                {map(APP_DATA_TYPE, type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
              </Select>
            </FormControl>
            {
              //Sub Fields
            }
            <div className={classes.subFields}>
              {
                //Javascript logic for derived data type
                localModel[key].data_type === 'derived' ?
                  <TextField key={key}
                    label={["\"", key, "\"", " Logic"].join()}
                    value={localModel[key].evaluation_logic ? localModel[key].evaluation_logic : ''}
                    size="small" variant="outlined"
                    className={classes.textField} fullWidth
                    onChange={event => handleLogicChange(event, key)}
                    onKeyDown={event => handleModelUpdateKeyPressed(event, key)}
                    onBlur={cancelModelChanges} />
                  : null
              }
              {
                //Foreign information for relational data type
                localModel[key].data_type === 'relational' ?
                  <span>
                    <FormControl variant="outlined" fullWidth size="small"
                      className={classes.option}
                      error={Boolean(foreignKeyValue === 'unknown')}>
                      <InputLabel>"{key}" Foreign Model</InputLabel>
                      <Select label={["\"", key, "\" Foreign Model"].join()} fullWidth
                        value={foreignKeyValue}
                        onChange={e => handleForeignKeyChange(e, key, 'model')}>
                        <MenuItem value="unknown">Unknown</MenuItem>
                        {map(props.appData, (item, key) => <MenuItem key={key} value={key}>{item.verbose_name ? item.verbose_name : key}</MenuItem>)}
                      </Select>
                    </FormControl>
                    <FormControl variant="outlined" fullWidth size="small"
                      className={classes.option}
                      error={Boolean(foreignKeyValue === 'unknown')}>
                      <InputLabel>"{key}" Foreign Key</InputLabel>
                      <Select label={"\"" + key + "\" Foreign Key"} fullWidth
                        value={keys(foreignModel).includes(get(localModel, [key, 'foreignKey', 'key'])) ? get(localModel, [key, 'foreignKey', 'key']) : 'unknown'}
                        onChange={e => handleForeignKeyChange(e, key, 'key')}>
                        <MenuItem value="unknown">Unknown</MenuItem>
                        {map(foreignModel, (item, key) => <MenuItem key={key} value={key}>{item.verbose_name ? item.verbose_name : key}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </span> : null
              }
            </div>
          </Fragment>
        }
        )}
      </div>
    </Collapsible >
  )
}
export default DataListModel;