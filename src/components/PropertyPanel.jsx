import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import SettingsIcon from '@material-ui/icons/Settings';
import BuildIcon from '@material-ui/icons/Build';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { APP_DATA_ACTION } from '../reducers/AppReducerDataActions';
import { APP_UI_ACTION } from '../reducers/AppReducerUIActions';
import get from 'lodash/get';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
    },
    title: {
        position: 'sticky',
        top: 0,
        zIndex: 10,
        padding: theme.spacing(1),
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    icon: {
        marginRight: theme.spacing(1),
    },
    activeIcon: {
        marginRight: theme.spacing(1),
        animationName: '$rotate',
        animationDuration: '2s',
        animationIterationCount: 'infinite',
    },
    '@keyframes rotate': {
        'from': { transform: 'rotate(0deg)' },
        'to': { transform: 'rotate(360deg)' },
    },
    action: {
        position: 'sticky',
        bottom: 0,
        zIndex: 10,
        padding: theme.spacing(2),
        display: 'flex',
    },
    button: {
        marginRight: theme.spacing(1),
    },
}));

const PropertyPanel = memo(props => {
    const classes = useStyles()
    const [active, setActive] = React.useState(false);

    const handleActivate = () => {
        setActive(true)
    }

    const handleDeactivate = () => {
        setActive(false)
    }
    return (
        <ClickAwayListener onClickAway={handleDeactivate}>
            <div onClick={handleActivate}>
                <Paper className={classes.title} square>
                    <SettingsIcon className={active ? classes.activeIcon : classes.icon} />
                    <BuildIcon className={classes.icon} />
                    <Typography variant='h6' >{props.title}</Typography>
                </Paper>

            </div>
        </ClickAwayListener>
    )
});

const mapStateToProps = state => {
    const activeCollectionKey = get(state, 'appUI.activeCollectionKey');
    const activeCollectionUIPath = ['appUI', 'dataUI', activeCollectionKey]
    return {
        appData: get(state, 'appData'),
        activeItem: get(state, ['appData', activeCollectionKey, 'data', get(state, 'appUI.activeItemKey')]),
        activeCollectionModel: get(state, ['appData', activeCollectionKey, "model"]),
        activeCollection: get(state, ['appData', activeCollectionKey]),
        sort: get(state, [...activeCollectionUIPath, 'sort']),
        filter: get(state, [...activeCollectionUIPath, 'filter']),
        displayStyle: get(state, [...activeCollectionUIPath, 'displayStyle']),
        visibleDataField: get(state, [...activeCollectionUIPath, 'visibleDataField']),
        animation: get(state, [...activeCollectionUIPath, 'animation']),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateCollectionModel: data => dispatch({ type: APP_DATA_ACTION.UPDATE_COLLECTION_MODEL, data }),
        deleteCollectionModelKey: data => dispatch({ type: APP_DATA_ACTION.DELETE_COLLECTION_MODEL_KEY, ...data }),
        updateItemValues: values => dispatch({ type: APP_DATA_ACTION.UPDATE_ITEM_VALUES, values }),
        onSort: data => dispatch({ type: APP_UI_ACTION.SORT, data }),
        onFilter: data => dispatch({ type: APP_UI_ACTION.FILTER, data }),
        setDisplayStyle: data => dispatch({ type: APP_UI_ACTION.SET_DISPLAY_STYLE, data }),
        setDataFieldVisibility: (event, value) => dispatch({ type: APP_UI_ACTION.SET_DATA_FIELD_VISIBILITY, value }),
        setPlayAnimation: (event, value) => dispatch({ type: APP_UI_ACTION.SET_PLAY_ANIMATION, value })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PropertyPanel);