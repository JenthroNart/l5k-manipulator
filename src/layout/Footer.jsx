import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    display: "flex",
    justifyContent: 'space-between'
  },
  grow: {
    flexGrow: 1,
  },
  multiLine: {
    display: 'flex',
    flexDirection: 'column'
  }
}));

const Footer = props => {
  const classes = useStyles();


  return (
    <div id={props.id} className={classes.root}>
        <Typography variant="caption" color="inherit">
          This Application Was Tested with Google Chrome Browser
        </Typography>
        <Typography variant="caption" color="inherit">
          Giang Tran © {new Date().getFullYear()}
        </Typography>
    </div>
  );
};

export default Footer
