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
import ReactTable from '../components/ReactTable';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import map from 'lodash/map';
import NestedPrograms from '../components/NestedPrograms';

const tabWidth = 350;
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
  treeView: {
    width: '100%',
  },
  nestedTreeView: {
    paddingLeft: theme.spacing(4),
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
  },

}));

const Body = memo(props => {
  const [bodyHeight, setBodyHeight] = useState(0)
  const classes = useStyles({ bodyHeight })

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


  const handleSelectionChange = collectionPath => {
    props.selectCollection({ path: collectionPath })
  }

  return (
    <div id="body-root" className={classes.root}>
      <Paper id="tabs" className={classes.tabs} square >
        <List
          component="nav"
          className={classes.treeView}
        >
          {
            map(get(props, 'visibleData'), item => {
              if (item === 'PROGRAM') {
                return (<NestedPrograms key={item}
                  data={get(props, ['dataUI', item])}
                  activeItem={get(props, 'activeCollectionPath')}
                  changeSelection={handleSelectionChange} />)
              }
              else return (<ListItem button key={item}
                selected={item === get(props, 'activeCollectionPath')}
                onClick={() => handleSelectionChange(item)} >
                <ListItemText primary={get(props, ['dataUI', item, 'verbose_name'])} />
              </ListItem>)
            })
          }
        </List>
      </Paper>
      <Paper id="tab-panels" className={classes.tabPanels} square>
        {get(props, "activeCollectionDataUI") ?
          <ReactTable
            Title={get(props, 'activeCollectionDataUI.verbose_name')}
            Items={get(props, 'activeCollectionDataUI.items')}
            onDelete={props.handleDelete}
          />
          : null}
      </Paper>
      {props.dataUI ? <div className={classes.rightPanel} ><PropertyPanel title="Options" /></div> : null}
      <AppDialog
        open={Boolean(get(props, 'appDiaglog.content') || get(props, 'appDiaglog.title'))}
        title={get(props, 'appDiaglog.title')}
        content={get(props, 'appDiaglog.content')}
        onClose={props.closeAppDialog} />
    </div >
  );
});

const mapStateToProps = state => {
  const activeCollectionPath = get(state, 'appUI.activeCollectionPath');
  return {
    dataUI: get(state, 'appUI.dataUI'),
    visibleData: get(state, 'appUI.dataUI.visibleData'),
    activeCollectionPath,
    activeCollectionDataUI: get(state, 'appUI.dataUI.' + activeCollectionPath),
    appFile: get(state, 'appFile'),
    appDiaglog: get(state, 'appUI.appDialog')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectCollection: data => dispatch({ type: APP_UI_ACTION.SELECT_COLLECTION, ...data }),
    closeAppDialog: () => dispatch({ type: APP_UI_ACTION.CLOSE_APP_DIALOG }),
    openAppDialong: information => dispatch({ type: APP_UI_ACTION.OPEN_APP_DIALOG, information }),
    handleDelete: data => dispatch({ type: APP_DATA_ACTION.DELETE_ITEMS, data })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Body);
