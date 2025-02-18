import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';

const styles = theme => ({
    root: {
        flex: 1,
        padding: theme.spacing.unit * 2,
        // slider causes overflow of panel
        overflow: 'hidden',
    },
    slider: {
        padding: '16px 12px',
    },
    thumb: {
        width: 20,
        height: 20,
    }
});

const EditConnectionPanel = observer(class EditConnectionPanel extends React.Component {
    constructor(props) {
        super(props);

        this._handleStartPlacePositionChanged = this._handleStartPlacePositionChanged.bind(this);
        this._handleEndPlacePositionChanged = this._handleEndPlacePositionChanged.bind(this);
    }

    _handleStartPlacePositionChanged(e, value) {
        this.props.onStartPlacePositionChanged({
            origin: this,
            value,
        })
    }

    _handleEndPlacePositionChanged(e, value) {
        this.props.onEndPlacePositionChanged({
            origin: this,
            value,
        });
    }

    _renderPlacePosition(options) {
        const { classes } = this.props;
        const { id, label, value, onChange } = options;

        return <>
            <Typography id={id}>{label}</Typography>
            <Slider
                classes={{ container: classes.slider, thumb: classes.thumb }}
                value={value}
                aria-labelledby={id}
                min={0}
                max={359}
                step={1}
                onChange={onChange}
            />
            <Typography variant="caption" align="right">{value}</Typography>
        </>;
    }

    render() {
        const { classes, connection } = this.props;

        return <div className={classes.root}>
            <div></div>
            {this._renderPlacePosition({
                id: "start-place-position",
                label: `${connection.startPlace.name} - Start Place Position`,
                value: connection.startPlacePosition,
                onChange: this._handleStartPlacePositionChanged,
            })}
            {this._renderPlacePosition({
                id: "end-place-position",
                label: `${connection.endPlace.name} - End Place Position`,
                value: connection.endPlacePosition,
                onChange: this._handleEndPlacePositionChanged,
            })}
        </div>;
    }
});

EditConnectionPanel.propTypes = {
    classes: PropTypes.object.isRequired,
    connection: PropTypes.shape({
        id: PropTypes.string.isRequired,
        startPlacePosition: PropTypes.number.isRequired,
        endPlacePosition: PropTypes.number.isRequired,
        startPlace: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }).isRequired,
        endPlace: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    onStartPlacePositionChanged: PropTypes.func.isRequired,
    onEndPlacePositionChanged: PropTypes.func.isRequired,
}

export default withStyles(styles)(EditConnectionPanel);
