import React from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { Map, TileLayer, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import grey from '@material-ui/core/colors/grey';
import EditTourPanel from './EditTourPanel';
import MapEditMode from './MapEditMode';
import { PlaceholderButton } from './../';
import { UploadImageDialog, ConfirmDialog } from './../Dialogs';
import Place from './Place';


const styles = {
    appBar: {
        position: 'relative',
    },
    tourName: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    noImageMap: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noImageMapPlaceholder: {
        color: grey[700],
        fontSize: '24px',
    },
    content: {
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    mapWrapper: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'stretch',
    },
    rightPanel: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 500,
    },
    statusBar: {
        borderTop: `1px solid ${grey[300]}`,
        padding: 3,
    },
    field: {
        marginLeft: 5,
    },
    lable: {
        fontWeight: 700,
        marginRight: 5,
    },
    value: {

    }
};

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

const TourDesigner = inject("tourStore")(observer(class TourDesigner extends React.Component {
    constructor(props) {
        super(props);

        this._handleSave = this._handleSave.bind(this);
        this._handleClose = this._handleClose.bind(this);
        this._handleMapClick = this._handleMapClick.bind(this);
        this._handleNameChanged = this._handleNameChanged.bind(this);
        this._handleMouseMoveOnMap = this._handleMouseMoveOnMap.bind(this);
        this._handleZoomChanged = this._handleZoomChanged.bind(this);
        this._handleChangeImageMapClick = this._handleChangeImageMapClick.bind(this);
        this._handleFileSelected = this._handleFileSelected.bind(this);
        this._handleOkConfirmClick = this._handleOkConfirmClick.bind(this);
        this._handleCancelConfigrmClick = this._handleCancelConfigrmClick.bind(this);
        this._handleModeChanged = this._handleModeChanged.bind(this);
        this._handlePlaceClick = this._handlePlaceClick.bind(this);
    }

    state = {
        currentLat: 0,
        currentLng: 0,
        currentZoom: 0,
        isOpenedUploadImageDialog: false,
        isOpenedConfirmDialog: false,
        mapEditMode: 0,
    };

    get tourStore() {
        return this.props.tourStore;
    }

    get editingTour() {
        return this.props.tourStore.editingTour;
    }

    get sessionId() {
        return this.props.tourStore.sessionId;
    }

    _handleChangeImageMapClick(e) {
        this.setState({ isOpenedUploadImageDialog: true });
    }

    _handleMouseMoveOnMap(e) {
        this.setState({ currentLat: e.latlng.lat, currentLng: e.latlng.lng });
    }

    _handleZoomChanged(e) {
        this.setState({ currentZoom: e.target._zoom });
    }

    _handleModeChanged(e) {
        this.setState({ mapEditMode: e.mode });
    }

    _handleClose() {
        if (this.tourStore.isDirty) {
            this.setState({ isOpenedConfirmDialog: true });
        } else {
            this.tourStore.cancelEditing();
        }
        // this.props.onClose && this.props.onClose({ origin: this });
    }

    _handleSave() {
        this.tourStore.saveEditing();
        // .then(() => {
        //     this.props.onSave && this.props.onSave({ origin: this });
        // });
    }

    _handleOkConfirmClick() {
        this.tourStore.saveEditing().then(() => {
            this.tourStore.cancelEditing();
        });
    }

    _handleCancelConfigrmClick() {
        this.tourStore.cancelEditing();
    }

    _handleNameChanged(e) {
        console.log(e);
        this.editingTour.name = e.name;
    }

    _handleMapClick(e) {
        if (this.state.mapEditMode === 1) {
            this.tourStore.addPlace({
                name: "Name 1",
                latitude: e.latlng.lat,
                longitude: e.latlng.lng,
            });
        }
    }


    _handlePlaceClick(e) {
        if (this.state.mapEditMode === 2) {
            this.tourStore.removePlace(e.place.id);
        }
    }

    _renderMap() {
        if (this.editingTour.hasMapImage && this.editingTour.mapType === 'Image') {
            return this._renderImageMap()
        } else if (this.editingTour.mapType === 'Earth') {
            return this._renderEarthMap()
        } else {
            return this._renderNoMapPlaceholder();
        }
    }

    _renderNoMapPlaceholder() {
        const { classes } = this.props;

        return (<div className={classes.noImageMap}>
            <Typography className={classes.noImageMapPlaceholder}>Image for map is not selected. Click <PlaceholderButton onClick={this._handleChangeImageMapClick} text={'here'} /> to select image</Typography>
        </div>);
    }

    _renderImageMap() {
        const { classes } = this.props;
        const bounds = [[0, 0], [this.editingTour.imageHeight, this.editingTour.imageWidth]];
        const mapStyle = this.state.mapEditMode !== 0 ? { cursor: 'pointer' } : {};

        const places = this.editingTour.places || [];

        return (<div className={classes.mapWrapper}>
            <Map crs={L.CRS.Simple}
                bounds={bounds}
                className={classes.map}
                style={mapStyle}
                onclick={this._handleMapClick}
                onmousemove={this._handleMouseMoveOnMap}
                onzoomend={this._handleZoomChanged}>
                <ImageOverlay url={this.editingTour.mapImageUrl} bounds={bounds} />
                {places.map(place => <Place key={place.id} place={place} onClick={this._handlePlaceClick} />)}
            </Map>
            {this._renderStatusBar()}
        </div>);
    }

    _renderStatusBar() {
        const { classes } = this.props;
        const { currentLng, currentLat, currentZoom } = this.state;

        return (
            <div className={classes.statusBar}>
                <span className={classes.field}>
                    <span className={classes.lable}>X:</span>
                    <span className={classes.value}>{parseInt(currentLng)}</span>
                </span>
                <span className={classes.field}>
                    <span className={classes.lable}>Y:</span>
                    <span className={classes.value}>{parseInt(currentLat)}</span>
                </span>
                <span className={classes.field}>
                    <span className={classes.lable}>Z:</span>
                    <span className={classes.value}>{parseInt(currentZoom)}</span>
                </span>
            </div>
        )
    }

    _renderEarthMap() {
        const { classes } = this.props;
        const state = {
            position: [0, 0],
            zoom: 13,
        };

        return (
            <Map center={state.position}
                zoom={state.zoom}
                className={classes.map}
                onclick={this._handleMapClick}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* <Circle center={position} radius={30} fill={true}>
                    <Popup>A pretty CSS3 popup. <br /> Easily customizable.</Popup>
                </Circle> */}
            </Map>
        );
    }

    _handleFileSelected(e) {
        return this.tourStore.updateImageMap(e.file, e.width, e.height).then(() => {
            this.setState({ isOpenedUploadImageDialog: false });
        });
    }

    render() {
        const { classes } = this.props;
        const { isOpenedUploadImageDialog, isOpenedConfirmDialog, mapEditMode } = this.state;

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
                        <Typography variant="h6" color="inherit" className={classes.tourName}>{this.editingTour.name}</Typography>
                        <Button color="inherit" onClick={this._handleSave}>save</Button>
                    </Toolbar>
                </AppBar>
                <div className={classes.content}>
                    {this._renderMap()}
                    {!this.editingTour.mapType && <Typography className={classes.map}>Map type is not defined</Typography>}
                    <div className={classes.rightPanel}>
                        <EditTourPanel
                            tour={this.editingTour}
                            onNameChanged={this._handleNameChanged}
                            onChangeImageMapClick={this._handleChangeImageMapClick}
                        />
                        <MapEditMode
                            value={mapEditMode}
                            onModeChanged={this._handleModeChanged} />
                    </div>
                </div>
                <UploadImageDialog
                    title="Upload new map"
                    prompt="Upload map of your virtual tour. E.g.: floor plan, street plan..."
                    isOpened={isOpenedUploadImageDialog}
                    onFileSelected={this._handleFileSelected}
                    onClose={() => this.setState({ isOpenedUploadImageDialog: false })}
                />
                <ConfirmDialog
                    title='Save Virtual Tour'
                    okButtonText='Save'
                    cancelButtonText="Don't save"
                    contentText="You are about to close the designer. Do you want to save your changes?"
                    onOkClick={this._handleOkConfirmClick}
                    onCancelClick={this._handleCancelConfigrmClick}
                    isOpened={isOpenedConfirmDialog}
                    onClose={() => this.setState({ isOpenedConfirmDialog: false })}
                />
            </Dialog>
        );
    }
}));

TourDesigner.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default withStyles(styles)(TourDesigner);
