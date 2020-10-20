import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';


const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(1)
  },
  titleBarLine1: {
    display: "flex",
    alignItems: "center"
  },
  expand: {
    transform: 'rotate(-90deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(0deg)',
  },
}));


const EntryValues = props => {
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false);


  React.useEffect(() => {
    props.defaultExpanded && setExpanded(true)
  }, [props.defaultExpanded])

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };





  return (
    < Paper hidden={props.hidden} className={classes.root}>
      <div>
        <div className={classes.titleBarLine1}>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            size="small"
          >
            <ExpandMoreIcon />
          </IconButton>
          <Typography variant="subtitle2" >{props.title}</Typography>
        </div>
        <Typography hidden={!props.caption} variant="caption" className={classes.caption} noWrap>{props.caption}</Typography>
      </div>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {props.children}
      </Collapse>
    </Paper >
  )
}

export default EntryValues;