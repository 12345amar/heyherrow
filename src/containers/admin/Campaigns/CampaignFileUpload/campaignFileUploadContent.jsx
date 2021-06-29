import React, { useState } from 'react';
import './index.scss';
import Dropzone from 'react-dropzone';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { campaignFileUpload } from '../../../../redux/actions';
import { ACCESS_TOKEN, API_MARKETING } from '../../../../constants';

const CampaignFileUploadContent = (props) => {
  const { getData, isSaveDraft, campaignFormData } = props;
  const [uploadFile, setUploadFile] = useState(campaignFormData && campaignFormData.fileUpload ? campaignFormData.fileUpload : '');
  const history = useHistory();
  const dispatch = useDispatch();
  const uploadService = (file) => {
    const formdata = new FormData();
    formdata.append('file', file);
    const requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`
      }
    };
    fetch(`${API_MARKETING}/upload`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const x = JSON.parse(result);
        const fileArray = {
          name: x[0].filename,
          fileUrl: x[0].filename,
          size: file.size,
          fileType: x[0].filetype
        };
        setUploadFile(fileArray);
      })
      .catch((error) => toast.error(error));
  };

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      if (file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type === 'image/svg+xml' || file.type === 'video/quicktime' || file.type === 'video/x-ms-wmv' || file.type === 'video/mp4' || file.type === 'audio/mpeg') {
        if (campaignFormData && campaignFormData.type === 'voiceMail') {
          if (file.type !== 'audio/mpeg') {
            toast.error('Please upload the audio file');
          } else {
            uploadService(file);
          }
        } else {
          uploadService(file);
        }
      } else {
        toast.error('Please upload only pdf, jpeg, svg, mov, wmv, mp4');
      }
    });
  };
  if (isSaveDraft) {
    getData(uploadFile);
  }
  const onClickNext = () => {
    if (!uploadFile) {
      toast.error('please select the file to upload');
    } else {
      const data = {
        fileUpload: uploadFile
      };
      dispatch(campaignFileUpload(data));
      if (campaignFormData.type !== 'social_post' && campaignFormData.type !== 'social_ad') {
        history.push('/admin/campaigns/new/selectRecipients');
      } else if (campaignFormData.selectedSocialMediaType === 'facebook' || campaignFormData.selectedSocialMediaType === 'instagram') {
        history.push('/admin/campaigns/new/Preview');
      } else {
        history.push('/admin/campaigns/new/scheduleCampaign');
      }
    }
  };

  return (
    <div className="campignfile-upload">
      {
        uploadFile
          ? (
            <div className="files-upload-success">
              <div className="selected-files-text">
                Selected file is uploaded
              </div>
            </div>
          )
          : (
            <Dropzone
              multiple={false}
              onDrop={(acceptedFiles) => onDrop(acceptedFiles)}
            >
              {({ getRootProps, getInputProps }) => (
                <div className="files-upload" {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div className="vector" />
                  <div className="rectangle">
                    <div className="plus" />
                  </div>
                  <div className="select-files-text">Select Files to Upload</div>
                  <div className="drag-drop-text">drag and drop, or copy and paste files</div>
                </div>
              )}
            </Dropzone>
          )
      }
      <div className="socialpostnextbutton">
        <Button onClick={() => { onClickNext(); }}>
          <span className="socialpostnexttext">Upload</span>
        </Button>
      </div>
    </div>
  );
};
CampaignFileUploadContent.propTypes = {
  campaignFormData: PropTypes.objectOf(PropTypes.any),
  getData: PropTypes.func,
  isSaveDraft: PropTypes.bool
};

CampaignFileUploadContent.defaultProps = {
  campaignFormData: {},
  getData: () => { },
  isSaveDraft: false
};

const mapStateToProps = (state) => ({
  campaignFormData: state.campaign.campaignFormData
});
export default connect(mapStateToProps, null)(CampaignFileUploadContent);
