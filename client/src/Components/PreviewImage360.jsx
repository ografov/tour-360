import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import classNames from 'classnames';

const styles = theme => ({
    root: {
        background: 'white',
        position: 'relative',
        border: `1px solid ${grey[300]}`,
        '&:hover': {
            '& $titleBar': {
                opacity: 1,
            },
        },
    },
    cover: {
        display: 'flex',
        maxWidth: '100%',
        maxHeight: '100%',
        width: '100%',
        height: 300
    },
});

class PreviewImage360 extends React.Component {
    
    render() {
        const { name, imageUrl, hasImage, classes, className } = this.props;
        const root = classNames({
            [className]: !!className,
            [classes.root]: true,
        });

        return (
            (hasImage) ? 
                <div className={root}>
                    <iframe className={classes.cover} title='Preview Place' src={imageUrl} alt={name || ''}></iframe>
                </div> 
            : <div/>
        );
    }
}

PreviewImage360.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    hasImage: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PreviewImage360);
