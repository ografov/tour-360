import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
    root: {
        border: 'none',
        background: 'none',
        fontSize: 'inherit',
        '&:hover': {
            textDecoration: 'underline',
            cursor: 'pointer',
            color: theme.palette.primary.dark,
        },
    },
});

export function PlaceholderButton(props) {
    return (<button className={props.classes.root} onClick={props.onClick}>{props.text}</button>);
}

PlaceholderButton.propTypes = {
    classes: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(PlaceholderButton);

