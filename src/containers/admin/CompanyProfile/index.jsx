/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useCallback, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { BlockPicker } from 'react-color';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';

import './index.scss';
import DropZone from 'react-dropzone';
import CustomIcon from '../../../components/common/CustomIcon';
import 'react-image-crop/dist/ReactCrop.css';
import { updateClientDetails } from '../../../api';
import { updateClientDetailFromForm } from '../../../redux/actions';

const CompanyProfile = () => {
  const { client } = useSelector((state) => state);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState('#3084F5');
  const [businessName, setBusinessName] = useState(client.name);
  const [businessOwner, setBusinessOwner] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(client.twilioNumber);
  const [email, setEmail] = useState('');
  const [hqAddress, setHqAddress] = useState(client.address);
  const [imgSrc, setImgSrc] = useState(client.logo);
  const colors = [
    '#3084F5',
    '#30C0FC',
    '#3CD8D1',
    '#F92AC0',
    '#F33362',
    '#FB7038',
    '#FAB32B',
    '#3BC63E',
    '#8753FB',
    '#666666',
    '#367C2C',
  ];
  const dispatch = useDispatch();

  useEffect(() => {
    setImgSrc(client.logo);
    setColor(client.color);
    setHqAddress(client.address);
    setPhoneNumber(client.twilioNumber);
  }, [client]);

  const onSave = (key, value) => {
    const body = new FormData();
    body.append(key, value);
    dispatch(updateClientDetails(client.id, body)).then(() => {
      toast.success('profile updated successfully');
    });
  };

  const toggleColor = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    toggleColor();
    onSave('color', color);
  };
  const handleChange = (e) => {
    setColor(e.hex);
    dispatch(updateClientDetailFromForm({
      color: e.hex
    }));
  };

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    acceptedFiles.forEach(() => {});
    rejectedFiles
      && rejectedFiles.length > 0
      && rejectedFiles[0].errors[0].code === 'file-too-large'
      && toast.error('This file is too big');
    rejectedFiles
      && rejectedFiles.length > 0
      && rejectedFiles[0].errors[0].code === 'file-invalid-type'
      && toast.error('This file is not an image');
    if (acceptedFiles && acceptedFiles[0]) {
      const reader = new FileReader();
      reader.addEventListener(
        'load',
        () => {
          setImgSrc(reader.result);
        },
        false
      );
      reader.readAsDataURL(acceptedFiles[0]);
      dispatch(updateClientDetails({
        logo: acceptedFiles[0]
      }));
      onSave('logo', acceptedFiles[0]);
    }
  });
  const onChange = (event, args) => {
    args === 'Admin Email Address' && setEmail(event.target.value.toLocaleLowerCase());
    args === 'Business Name' && setBusinessName(event.target.value);
    args === 'Business Owner' && setBusinessOwner(event.target.value);
    args === 'HQ Address' && setHqAddress(event.target.value);
    args === 'Phone Number' && setPhoneNumber(event.target.value);
  };

  return (
    <>
      <div className="contentContainer company-profile-container">
        <div className="centerContent bigArea">
          <div className="centerBoxContainer">
            <div className="cardContainer">
              <div className="detail-cardBox">
                <div className="innerCardBox">
                  <div className="cardHeader">
                    <h4>Admin Details</h4>
                    <p>Add or manage company profile.</p>
                  </div>
                  <div className="cardBody">
                    <div className="customerDetail">
                      <CustomIcon icon="Placeholder/Person/Medium/Active" />
                      <br />
                      <TextField
                        label="Admin Email Address"
                        variant="outlined"
                        className="formElement"
                        size="small"
                        value={email}
                        onChange={(e) => onChange(e, 'Admin Email Address')}
                        onBlur={(e) => onSave(e, 'email')}
                      />
                      <TextField
                        label="Business Name"
                        variant="outlined"
                        className="formElement"
                        size="small"
                        value={businessName}
                        onChange={(e) => onChange(e, 'Business Name')}
                        onBlur={() => onSave(businessName, 'businessName')}
                      />
                      <TextField
                        label="Business Owner"
                        variant="outlined"
                        className="formElement"
                        size="small"
                        value={businessOwner}
                        onChange={(e) => onChange(e, 'Business Owner')}
                        onBlur={() => onSave('businessOwner', businessOwner)}
                      />
                      <TextField
                        label="Twilio Number"
                        variant="outlined"
                        className="formElement"
                        size="small"
                        value={phoneNumber}
                        onChange={(e) => onChange(e, 'Phone Number')}
                        onBlur={() => onSave('phoneNumber', phoneNumber)}
                      />
                      <TextField
                        label="HQ Address"
                        variant="outlined"
                        className="formElement"
                        size="small"
                        value={hqAddress}
                        multiline
                        rows={4}
                        onChange={(e) => onChange(e, 'HQ Address')}
                        onBlur={() => onSave('hqAddress', hqAddress)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="uploadCardBox">
                <div className="innerCardBox">
                  <div className="cardHeader">
                    <h4>Brand Logo</h4>
                    <p>Supported file formats are svg, png, and jpeg.</p>
                  </div>
                  <div className="cardBody">
                    <div className="uploadLogoBox">
                      <DropZone
                        onDrop={
                          (accepted, rejected) => onDrop(accepted, rejected)
                        }
                        multiple={false}
                        accept="image/png, .svg, image/jpeg, image/jpg, image/x-png"
                        maxSize={8000000}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <div
                            className={
                              `uploadCon${
                              (imgSrc == null && ' backColor') || ''}`
                            }
                            {...getRootProps()}
                          >
                            {imgSrc != null && (
                              <img id="uploaded-profile" src={imgSrc} alt="" />
                            )}
                            <input {...getInputProps()} />
                            {imgSrc == null && (
                              <CustomIcon icon="Header/Icon/Add" />
                            )}
                          </div>
                        )}
                      </DropZone>
                      <h4>{businessName}</h4>
                    </div>
                  </div>
                </div>
                <div className="innerCardBox">
                  <div className="cardHeader">
                    <h4>Brand Color</h4>
                    <p>Provide primary #hax code color value of your brand.</p>
                  </div>
                  <div className="cardBody">
                    <div className="uploadLogoBox">
                      <div
                        className="uploadCon"
                        style={{ backgroundColor: color }}
                      />
                      <h4>
                        <span>Choose Color</span>
                        <button
                          className="colorPickerBtn"
                          onClick={() => toggleColor()}
                          type="button"
                        />
                      </h4>
                      {displayColorPicker ? (
                        <div className="colorPopover">
                          <div
                            className="colorPopoverCover"
                            onClick={() => handleClose()}
                          />
                          <BlockPicker
                            color={color}
                            colors={colors}
                            onChange={(val) => handleChange(val)}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyProfile;
