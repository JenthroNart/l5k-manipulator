import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { useSpring, animated } from 'react-spring'
import range from 'lodash/range'
import compact from 'lodash/compact'


const useStyles = makeStyles(theme => ({
    textField: {
        padding: theme.spacing(1),
    },
    background: {
        width: props => props.width ? props.width : "100%",
        height: props => props.height ? props.height : "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    foreground: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        display: "block",
        zIndex: 1,
        color: props => props.foreground,
        fontWeight: "bold",
    },
}));


const AnimatedPaper = animated(Paper);

const GraphicIcon = memo(props => {
    const classes = useStyles(props)
    let colors = Array.isArray(props.background) ? props.background : [props.background]
    colors = compact([...colors])
    // //Static Background
    const percentage = 100 / colors.length
    let staticBg = props.direction ? props.direction : "to bottom";
    colors.forEach((color, index) => {
        staticBg = staticBg + "," + color + " " + percentage * index + "% " + percentage * (index + 1) + "%"
    });
    staticBg = "linear-gradient(" + staticBg + ")"

    //Animated background
    const duration = colors.length * 1000
    colors.push(colors[0])
    const { colorStepper } = useSpring({
        from: { colorStepper: 0 },
        to: { colorStepper: colors.length },
        loop: true,
        config: { duration: duration },
        reset: true,
    })
    let animatedBg
    try {
        animatedBg = colorStepper.interpolate(range(colors.length), colors)
    } catch{ }
    const bgStyle = { background: props.animated ? animatedBg : staticBg }

    return (
        <AnimatedPaper className={classes.background} style={bgStyle} elevation={5} >
            {props.icon ? <div className={classes.foreground}>{props.icon}</div> : null}
            {props.textField ?
                <TextField className={classes.textField} value={props.textField} size="small" variant="outlined" fullWidth />
                : null}
            {props.text ?
                <Typography className={classes.foreground} noWrap align='center'>
                    {props.text}
                </Typography>
                : null}
        </AnimatedPaper>
    )
});

export default GraphicIcon