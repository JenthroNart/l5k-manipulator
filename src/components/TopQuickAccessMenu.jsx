import React, { useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import get from "lodash/get";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import * as TopMenuHandler from "./TopMenuHandler";
import Tooltip from "@material-ui/core/Tooltip";
import AlertDialog from "./AlertDialog";
import PostAddIcon from "@material-ui/icons/PostAdd";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import { CONTENT_TYPE } from "../reducers/AppReducerDataActions";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  input: {
    display: "none",
  },
}));

const TopQuickAccessMenu = (props) => {
  const classes = useStyles();
  const [alertDialogAction, setAlertDialogAction] = useState(false);

  //Handling action of user operated on app dialog
  const handleDialogClose = () => {
    setAlertDialogAction(null);
  };

  const handleDialogYes = () => {
    TopMenuHandler.handleDownloadFile(props.appData, props.fileName);
    handleDialogClose();
  };

  const handleDialogNo = () => {
    handleDialogClose();
  };

  //UI portion of the component
  return (
    <div className={classes.container}>
      <input
        accept=".l5k,.l5x"
        className={classes.input}
        id="icon-button-open-Master"
        type="file"
        onChange={(e) => TopMenuHandler.handleOpenFile(e, CONTENT_TYPE.Master)}
      />
      <label htmlFor="icon-button-open-Master">
        <Tooltip title="Open L5K">
          <IconButton component="span">
            <ImportContactsIcon />
          </IconButton>
        </Tooltip>
      </label>
      <Tooltip title="Download L5K">
        <span>
          <IconButton
            className={classes.button}
            disabled={!get(props, "appFile.outputFile")}
            onClick={() => TopMenuHandler.handleDownloadFile(props.appFile)}
          >
            <SaveAltIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Divider orientation="vertical" flexItem />
      <input
        accept=".l5k,.l5x"
        className={classes.input}
        id="icon-button-open-Parts"
        type="file"
        onChange={(e) => TopMenuHandler.handleOpenFile(e, CONTENT_TYPE.Parts)}
      />
      <label htmlFor="icon-button-open-Parts">
        <Tooltip title="Open L5K Parts">
          <IconButton component="span">
            <PostAddIcon />
          </IconButton>
        </Tooltip>
      </label>
      <AlertDialog
        title="Consideration"
        content="Do you want to download current L5K content"
        open={Boolean(alertDialogAction)}
        onClose={handleDialogClose}
        onNo={handleDialogNo}
        onYes={handleDialogYes}
      />
      <Divider orientation="vertical" flexItem />
      <Tooltip title="Connect">
        <span>
          <IconButton
            className={classes.button}
            onClick={TopMenuHandler.connectPLC  }
          >
            <RadioButtonCheckedIcon />
          </IconButton>
        </span>
      </Tooltip>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    appData: get(state, "appData"),
    appFile: get(state, "appFile"),
    outputFile: get(state, "appFile.outputFile"),
    fileParseReq: get(state, "appFile.fileParseReq"),
  };
};

export default connect(mapStateToProps, null)(TopQuickAccessMenu);
