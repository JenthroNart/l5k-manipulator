import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import TopQuickAccessMenu from '../components/TopQuickAccessMenu';
import Switch from '@material-ui/core/Switch';
import { APP_UI_ACTION } from "../reducers/AppReducerUIActions";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
  },
  line: {
    width: "100%",
    display: "flex",
  },
  grow:
  {
    flexGrow: 1
  }
}));


const Header = props => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.line}>
        <Typography variant='h6'>
          L5K Manipulator
        </Typography>
        <div className={classes.grow} />
        <Switch name="Dark Mode" color="default" onChange={props.toggleUIMode} />
      </div>
      <div className={classes.line}>
        <TopQuickAccessMenu />
        <div className={classes.grow} />
        <Typography variant='h6'>
          Brock Solutions
        </Typography>
      </div>
    </div>
  )
};


const mapDispatchToProps = (dispatch) => {
  return {
    toggleUIMode: data => { dispatch({ type: APP_UI_ACTION.TOGGLE_UI_MODE, data }) },
  };
};

export default connect(null, mapDispatchToProps)(Header);

