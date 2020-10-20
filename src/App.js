import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from './layout/Header';
import Body from './layout/Body';
import Footer from './layout/Footer';
import { Paper } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import AppReducer from './reducers/AppReducer';
import get from 'lodash/get';


const useStyles = makeStyles(theme => ({
  topAppBar: {
    width: "100%",
    zIndex: 3,
    position: "sticky",
    top: "0px",
    bottom: "auto",
    padding: theme.spacing(2)
  },
  bottomAppBar: {
    width: "100%",
    zIndex: 3,
    position: "sticky",
    bottom: "0px",
    padding: theme.spacing(2)
  },
  body: {

  }
}))

const App = props => {
  const classes = useStyles();
  const theme = createMuiTheme({
    palette: {
      type: props.mode ? props.mode : 'light',
    }
  });

  const appBarColor = theme.palette.type === "dark" ? grey[900] : theme.palette.primary.main;


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Paper id="app-header" className={classes.topAppBar} square style={{ background: appBarColor }}>
        <Header />
      </Paper>
      <Paper id="app-body" className={classes.body}>
        <Body />
      </Paper>
      <Paper id="app-footer" className={classes.bottomAppBar} square style={{ background: appBarColor }}>
        <Footer />
      </Paper>
    </ThemeProvider>
  )
};


//establishing props connection to redux store
const mapStateToProps = state => {
  return {
    mode: get(state, 'appUI.mode', 'dark'),
  };
};
const ConnectedApp = connect(mapStateToProps, null)(App);

//connecting redux store for the whole app and exporting for html injection
const store = createStore(AppReducer);
const AppContainer = () => {
  return (<Provider store={store}><ConnectedApp /></Provider>)
}
export default AppContainer
//export redux store for dispatching everywhere in the app
export { store };


