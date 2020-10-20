import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    display: "flex",
  },
  grow: {
    flexGrow: 1,
  }
}));

const Footer = props => {
  const classes = useStyles();


  return (
    <div id={props.id} className={classes.root}>
      <div className={classes.grow} />
      <Typography variant="caption" color="inherit">
        Giang Tran © 2020
        </Typography>
    </div>
  );
};

export default Footer
