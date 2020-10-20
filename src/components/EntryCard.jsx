import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GraphicIcon from './GraphicIcon';
import DataField from './DataField';
import map from 'lodash/map';
import has from 'lodash/has';
import get from 'lodash/get';
import includes from 'lodash/includes';
import toString from 'lodash/toString';
import keys from 'lodash/keys';
import isArray from 'lodash/isArray'
import { formatRadix } from "../ultility/numberFormat";

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: theme.spacing(1.5),
    },
    dataField: {
        marginLeft: theme.spacing(1),
    },
}));

const EntryCard = memo(props => {
    const classes = useStyles();
    const dataModel = props.model ? props.model : props.item
    const background = get(props, ['item', 'background']) ? get(props, ['item', 'background']) : toString(get(props, ['item', 'color']))
    const visibleDataField = isArray(props.visibleDataField) ? props.visibleDataField : keys(dataModel)
    return (
        <div className={classes.root} onClick={props.onClick}>
            {has(dataModel, 'verbose_name') || has(dataModel, 'foreground') || has(dataModel, 'background') || has(dataModel, 'color') ?
                <GraphicIcon
                    height={40}
                    text={includes(visibleDataField, 'verbose_name') ? get(props, ['item', 'verbose_name']) : ''}
                    foreground={includes(visibleDataField, 'foreground') ? get(props, ['item', 'foreground']) : null}
                    background={includes(visibleDataField, 'background') ? background : null}
                    animated={props.animated ? props.animated : false} />
                : null}
            {map(dataModel, (item, key) => {
                if (!includes(['verbose_name', 'foreground', 'background', 'color'], key) &&
                    includes(visibleDataField, key)) {
                    let value = get(props, ['item', key])
                    value = get(props, ['displayStyle', key]) ? formatRadix(value, get(props, ['displayStyle', key])) : value
                    value = value ? value : '.'
                    let label = get(dataModel, [key, 'verbose_name'])
                    label = label ? label : key
                    return <DataField key={key} className={classes.dataField} value={value} label={label} />
                }
            })
            }
        </div >
    )
});

export default EntryCard