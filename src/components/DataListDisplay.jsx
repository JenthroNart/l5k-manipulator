import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Collapsible from "./Collapsible";
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import MovieFilterIcon from '@material-ui/icons/MovieFilter';
import Typography from '@material-ui/core/Typography';
import map from 'lodash/map';
import get from 'lodash/get';
import keys from 'lodash/keys';
import includes from 'lodash/includes';
import has from 'lodash/has';


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
  colorSelection: {
    marginTop: theme.spacing(1)
  },
  option: {
    marginTop: theme.spacing(1)
  },
  caption: {
    marginLeft: theme.spacing(2)
  },
  toggleButtons: {
    width: '100%',
    marginTop: theme.spacing(1),
  }
}));


const StyledToggleButton = withStyles({
  label: {
    justifyContent: 'flex-start'
  }
})(ToggleButton)

const DataListDisplay = props => {
  const classes = useStyles()
  const [filterValue, setFilterValue] = useState('')


  React.useEffect(() => {
    setFilterValue(get(props.filter, keys(props.filter)[0], ''))
  }, [props.filter])

  const handleSortChange = (event) => {
    props.onSort([event.target.value])
  };

  const handleSetFilterBy = (event) => {
    const data = event.target.value !== -1 ? { [event.target.value]: '' } : {}
    props.onFilter(data)
  };

  const handleFilterValueChange = event => {
    setFilterValue(event.target.value)
  }

  const handleKeyPressed = event => {
    switch (event.key) {
      case "Enter":
        props.onFilter({ [keys(props.filter)[0]]: filterValue })
        event.target.blur()
        break;
      case "Escape":
        event.target.blur()
        break;
      default:
    }
  }

  const cancleEdit = () => {
    setFilterValue(get(props, ['filter', 0]))
  }


  if (keys(props.collectionModel).length < 1) return null;
  return (
    < Collapsible title={props.title} >
      <div className={classes.content}>

        {keys(props.collectionModel).length > 0 ? <FormControl variant="outlined" fullWidth className={classes.option} size="small">
          <InputLabel id="sort-label" >Sort By</InputLabel>
          <Select
            labelId="sort-label"
            value={get(props, ['sort', 0]) ? get(props, ['sort', 0]) : -1}
            onChange={handleSortChange}
            label="Sort By"
          >
            <MenuItem value={-1}>None</MenuItem>
            {map(props.collectionModel, (item, key) => <MenuItem value={key} key={key}>{item.verbose_name ? item.verbose_name : key}</MenuItem>)}
          </Select>
        </FormControl> : null}


        {keys(props.collectionModel).length > 0 ? <FormControl variant="outlined" fullWidth className={classes.option} size="small">
          <InputLabel id="filter-label">Filter On</InputLabel>
          <Select
            labelId="filter-label"
            value={has(props.collectionModel, keys(props.filter)[0]) ? keys(props.filter)[0] : -1}
            onChange={handleSetFilterBy}
            label="Filter On"
          >
            <MenuItem value={-1}>None</MenuItem>
            {map(props.collectionModel, (item, key) => <MenuItem value={key} key={key}>{item.verbose_name ? item.verbose_name : key}</MenuItem>)}
          </Select>
        </FormControl> : null}


        {has(props.collectionModel, keys(props.filter)[0]) ?
          < TextField value={filterValue ? filterValue : ''} label="Filter Value" variant="outlined" fullWidth className={classes.textField} size="small"
            onChange={handleFilterValueChange}
            onKeyDown={handleKeyPressed}
            onBlur={cancleEdit} />
          : null}

        {map(props.collectionModel, (item, key) => {
          const dataType = get(item, 'data_type');
          if (includes(['number', 'integer'], dataType)) {
            let verboseName = get(item, 'verbose_name')
            verboseName = verboseName ? verboseName : key
            let radix = get(props, ['displayStyle', key])
            radix = radix ? radix : 'decimal'
            return <FormControl key={key} variant="outlined" fullWidth className={classes.option} size="small">
              <InputLabel id={key}>{verboseName} Radix</InputLabel>
              <Select
                labelId={key}
                value={radix}
                onChange={e => props.setDisplayStyle({ [key]: e.target.value })}
                label={verboseName + ' Radix'}
              >
                <MenuItem value="decimal">Decimal</MenuItem>
                <MenuItem value="binary">Binary</MenuItem>
                <MenuItem value="hex">Hex</MenuItem>
              </Select>
            </FormControl>
          }
          else return null
        }
        )}

        <ToggleButtonGroup className={classes.toggleButtons}
          value={props.animation}
          onChange={props.setPlayAnimation}
          size='small' orientation="vertical">
          {keys(props.collectionModel).includes('background') ? <StyledToggleButton value='animation'>
            <MovieFilterIcon />
            <Typography style={{ marginLeft: '10px', textTransform: 'none' }}>Animation</Typography>
          </StyledToggleButton> : null}
        </ToggleButtonGroup>

        <ToggleButtonGroup className={classes.toggleButtons}
          value={props.visibleDataField}
          onChange={props.setDataFieldVisibility}
          size='small' orientation="vertical">
          {map(props.collectionModel, (item, key) =>
            <StyledToggleButton key={key} value={key} >
              <VisibilityIcon />
              <Typography style={{ marginLeft: '10px', textTransform: 'none' }}>{item.verbose_name}</Typography>
            </StyledToggleButton>
          )}
        </ToggleButtonGroup>
      </div>
    </Collapsible >
  )
}

export default DataListDisplay;