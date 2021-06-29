import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  Grid,
  CardContent,
  CardMedia,
  IconButton,
  CardHeader,
  Menu,
  MenuItem,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DefualtPdf from '../../../assets/images/pdf-icon.png';
import DefualtPlay from '../../../assets/images/play.png';
import DefualtText from '../../../assets/images/text.png';
// const useStyles = withStyles(() => ({}));

const styles = (theme) => ({
  card: {
    display: 'flex',
    width: '100%',
    height: '100%'
    // width: '274px',
    // height: '264px'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
    padding: '0px',
    // width: '274px',
  },
  cover: {
    // width: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  videoId: {
    width: '275',
  }
});

function MusicCard(campaignProps) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [campaignPin, setcampaignPin] = useState(campaignProps.is_pin);
  const history = useHistory();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handlePin = () => {
    campaignProps.handleCampaignPin(campaignProps.id, !campaignPin);
    setcampaignPin(!campaignPin);
    handleClose();
  };
  const handleArchive = () => {
    campaignProps.handleCampaignArchived(campaignProps.id);
    handleClose();
  };
  const handleDuplicate = () => {
    campaignProps.handleCampaignDupliate(campaignProps.id);
    handleClose();
  };
  const getImagePreview = (event, img, title) => {
    event.preventDefault();
    localStorage.setItem('previewTitle', title);
    localStorage.setItem('previewImage', img);
    history.push('/admin/campaign/preview');
  };
  return (
    <Grid item md={4} key={campaignProps.campaign_name} spacing={2}>
      <Card className={campaignProps.classes.card} style={{ width: '100%' }}>
        <div className={campaignProps.classes.details} style={{ width: '100%' }}>
          <CardHeader
            title={campaignProps.campaign_name}
            action={(
              <IconButton aria-label="settings">
                <MoreVertIcon onClick={handleClick} />
              </IconButton>
            )}
            titleTypographyProps={{ align: 'left', variant: 'subtitle' }}
            subheaderTypographyProps={{ align: 'center' }}
            // action={tier.title === 'Pro' ? <StarIcon /> : null}
            className={campaignProps.classes.cardHeader}
          />
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handlePin}>{campaignPin ? 'Unpin' : 'Pin'}</MenuItem>
            <MenuItem>
              <a href="/campaign/preview" className="prev-anchor" onClick={(e) => { getImagePreview(e, campaignProps.data.fileUrl, campaignProps.campaign_name); return false; }}>Preview</a>
            </MenuItem>
            <MenuItem onClick={handleDuplicate}>Duplicate</MenuItem>
            <MenuItem onClick={handleArchive}>Archived</MenuItem>
          </Menu>
          <CardContent className={campaignProps.classes.content}>
            <CardContent className={campaignProps.classes.content} style={{ paddingBottom: '0px' }}>
              {(campaignProps.data.fileType && (campaignProps.data.fileType.includes('pdf') || campaignProps.data.fileType.includes('video') || campaignProps.data.fileType.includes('audio')))
                ? (
                  <CardMedia
                    className="campaign__cardimage_default"
                    image={campaignProps.data.fileType.includes('pdf') ? DefualtPdf : DefualtPlay}
                    title={campaignProps.campaign_name}
                  />
                )
                : (
                  <CardMedia
                    className={campaignProps.data.fileType === 'application/text' ? 'campaign__cardimage_default' : 'campaign__cardimage'}
                    image={campaignProps.data.fileType === 'application/text' ? DefualtText : campaignProps.data.fileUrl}
                    title={campaignProps.campaign_name}
                  />
                )}
            </CardContent>
          </CardContent>
        </div>
        <CardMedia
          className={campaignProps.classes.cover}
          image="/static/images/cards/live-from-space.jpg"
          title="Live from space album cover"
        />
      </Card>
    </Grid>
  );
}
export default withStyles(styles, { withTheme: true })(MusicCard);
