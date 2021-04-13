import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import map from 'lodash/map';
import get from 'lodash/get';


const useStyles = makeStyles(theme => ({
  root: {
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));


const NestedPrograms = props => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
    props.changeSelection('PROGRAM')
  };
  return (
    <Fragment>
      <ListItem button onClick={handleClick}>
        <ListItemText primary="Programs" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {
            map(get(props, 'data.items'), (item, index) => {
              return (
                <ListItem key={index} button className={classes.nested}
                  selected={props.activeItem === 'PROGRAM.items[' + index + ']' }
                  onClick={() => props.changeSelection('PROGRAM.items[' + index + ']')}
                >
                  <ListItemText primary={item.verbose_name} />
                </ListItem>)
            })
          }
        </List>
      </Collapse>
    </Fragment>
  );
}

export default NestedPrograms