import React from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import isFunction from 'lodash/isFunction'



const VisibilityButton = props => {
    const [on, setOn] = React.useState(true);

    const handleChange = event => {
        if (props.onChange) {
            props.onChange({ ...event, value: on })
        }
    }
    const handleClick = event => {
        isFunction(props.onChange) && props.onChange(event, !on)
        event.stopPropagation();
        setOn(!on)
    }
    return (
        <IconButton onClick={handleClick} onChange={handleChange} size='small'>
            {on ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>
    )
}

export default VisibilityButton