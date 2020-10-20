import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import GetAppIcon from '@material-ui/icons/GetApp';
import get from 'lodash/get';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import keys from 'lodash/keys';
import * as TopMenuHandler from './TopMenuHandler';
import Tooltip from '@material-ui/core/Tooltip';
import AlertDialog from './AlertDialog';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  input: {
    display: 'none',
  },
  newCollectionForm: {
    display: 'flex',
    padding: theme.spacing(2)
  }
}));

const TopQuickAccessMenu = props => {
  const classes = useStyles();
  const [alertDialogAction, setAlertDialogAction] = useState(false)

  const handleOpenDialog = useCallback((action) => {
    if (keys(props.appData).length > 0) setAlertDialogAction(action)
    else projectActions(action)
  }, [props.appData])

  useEffect(() => {
    props.fileParseReq && handleOpenDialog('parseFile')
  }, [props.fileParseReq, handleOpenDialog])

  const handleDialogClose = () => {
    setAlertDialogAction(null)
  }

  const handleDialogYes = () => {
    TopMenuHandler.handleDownloadFile(props.appData, props.fileName)
    projectActions(alertDialogAction)
    handleDialogClose()
  }

  const handleDialogNo = () => {
    projectActions(alertDialogAction)
    handleDialogClose()
  }

  const projectActions = action => {
    switch (action) {
      case 'parseFile':
        TopMenuHandler.parseFile()
        break;
      default:
    }
  }

  return (
    <div className={classes.container}>
      <input accept=".l5k" className={classes.input} id="icon-button-file" type="file" onChange={e => TopMenuHandler.handleOpenFile(e)} />
      <label htmlFor="icon-button-file">
        <Tooltip title='Open L5K'>
          <IconButton component="span" >
            <ImportContactsIcon />
          </IconButton>
        </Tooltip>
      </label>
      <Tooltip title='Download L5K'>
        <span>
          <IconButton className={classes.button} disabled={keys(props.appData).length === 0} onClick={() => TopMenuHandler.handleDownloadFile(props.appData, props.fileName)}  >
            <GetAppIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Divider orientation="vertical" flexItem />
      <AlertDialog title='Consideration' content='Do you want to download current L5K content'
        open={Boolean(alertDialogAction)}
        onClose={handleDialogClose}
        onNo={handleDialogNo}
        onYes={handleDialogYes} />
    </div >
  )
}

const mapStateToProps = (state) => {
  return {
    activeCollectionKey: get(state, 'appUI.activeCollectionKey'),
    activeItemKey: get(state, 'appUI.activeItemKey'),
    appData: get(state, 'appData'),
    fileName: get(state, 'appFile.fileName'),
    fileParseReq: get(state, 'appFile.fileParseReq')
  };
};

export default connect(mapStateToProps, null)(TopQuickAccessMenu);

