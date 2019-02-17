import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

const styles = {
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    map: {
        height: '100%',
    }
};

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class TourDesigner extends React.Component {
    constructor(props) {
        super(props);

        this._handleSave = this._handleSave.bind(this);
        this._handleClose = this._handleClose.bind(this);
    }

    state = {
        lat: 51.505,
        lng: -0.09,
        zoom: 13,
    };

    _handleClose() {
        this.props.onClose && this.props.onClose({ origin: this });
    }

    _handleSave() {
        this.props.onSave && this.props.onSave({ origin: this });
    }

    render() {
        const { classes, tour } = this.props;
        const position = [this.state.lat, this.state.lng]

        return (
            <Dialog
                open={true}
                fullScreen
                onClose={this._handleClose}
                TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton color="inherit" onClick={this._handleClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" className={classes.flex}>{tour.name}</Typography>
                        <Button color="inherit" onClick={this._handleSave}>save</Button>
                    </Toolbar>
                </AppBar>
                <Map center={position} zoom={this.state.zoom} className={classes.map}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                        <Popup>A pretty CSS3 popup. <br /> Easily customizable.</Popup>
                    </Marker>
                </Map>
            </Dialog>
        );
    }
}

TourDesigner.propTypes = {
    tour: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired,
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default withStyles(styles)(TourDesigner);
