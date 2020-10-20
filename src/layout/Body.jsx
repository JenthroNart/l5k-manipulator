import React, { useEffect, useState, memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import PropertyPanel from "../components/PropertyPanel";
import { APP_UI_ACTION } from '../reducers/AppReducerUIActions';
import { APP_DATA_ACTION } from '../reducers/AppReducerDataActions';
import AppDialog from '../components/AlertDialog';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import path from '../data/input.L5K'
import { L5K, getL5K_Component } from '../ultility/L5K'


const tabWidth = 200;
const propertyWidth = 350;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  tabs: {
    width: tabWidth,
    height: "100%",
    position: "fixed",
    zIndex: 2,
  },
  tabPanels: {
    height: props => props.bodyHeight,
    flexGrow: 1,
    marginLeft: tabWidth + theme.spacing(1),
    marginRight: propertyWidth + theme.spacing(1),
    overflow: "auto",
  },
  rightPanel: {
    width: propertyWidth,
    height: props => props.bodyHeight,
    right: "0px",
    position: "fixed",
    zIndex: 2,
    overflow: "auto",
  },
  textField: {
    bottom: '0px'
  }
}));

const Body = memo(props => {
  const [bodyHeight, setBodyHeight] = useState(0)
  const classes = useStyles({ bodyHeight })
  const [input, setInput] = React.useState(String(""))

  useEffect(() => {
    setBodyHeight(window.innerHeight - (document.getElementById("app-header").offsetHeight + document.getElementById("app-footer").offsetHeight))

    const handleResize = debounce(() => {
      setBodyHeight(window.innerHeight - (document.getElementById("app-header").offsetHeight + document.getElementById("app-footer").offsetHeight))
    }, 500)

    window.addEventListener('resize', handleResize)
    return _ => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // ---------------------------------Logic for Testing regex ------------------------------
  const readTextFile = file => {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = () => {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status === 0) {
          setInput(String(rawFile.responseText))
        }
      }
    };
    rawFile.send(null);
  };
  React.useEffect(() => {
    readTextFile(path)
  }, [])

  React.useEffect(() => {
    console.log(getL5K_Component(input, L5K.Component.DataType))
  }, [input])

  // ---------------------------------Logic for Testing regex ------------------------------

  return (
    <div id="body-root" className={classes.root}>
      <Paper id="tabs" className={classes.tabs} square >
      </Paper>
      <Paper id="tab-panels" className={classes.tabPanels} square>
      </Paper>
      {props.appData ? <div className={classes.rightPanel} ><PropertyPanel title="Options" /></div> : null}
      <AppDialog
        open={Boolean(get(props, 'appDiaglog.content') || get(props, 'appDiaglog.title'))}
        title={get(props, 'appDiaglog.title')}
        content={get(props, 'appDiaglog.content')}
        onClose={props.closeAppDialog} />
    </div >
  );
});

const mapStateToProps = state => {
  const activeCollectionKey = get(state, 'appUI.activeCollectionKey');
  return {
    appData: get(state, 'appData'),
    activeCollectionKey: activeCollectionKey,
    activeCollection: get(state, ['appData', activeCollectionKey]),
    activeCollectionUI: get(state, ['appUI', 'dataUI', activeCollectionKey]),
    appDiaglog: get(state, 'appUI.appDialog')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectCollectionItem: data => dispatch({ type: APP_UI_ACTION.SELECT_COLLECTION_ITEM, ...data }),
    deleteCollectionItem: data => dispatch({ type: APP_DATA_ACTION.DELETE_COLLECTION_ITEM, ...data }),
    closeAppDialog: () => dispatch({ type: APP_UI_ACTION.CLOSE_APP_DIALOG }),
    openAppDialong: information => dispatch({ type: APP_UI_ACTION.OPEN_APP_DIALOG, information }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Body);
