import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import './index.scss';
import PropTypes from 'prop-types';
import Tabs from '../../../components/common/Tab';

const tabs = [
  'Preview',
  'Analytics',
  'Responses'
];

const CampaignsPreviewHeader = ({
  title,
  BtnContent,
  BtnRightContent
}) => {
  // eslint-disable-next-line no-unused-vars
  const [activeTab, setActiveTab] = useState(0);

  const renderMenu = () => {
    <div className="centerSideheader" />;
  };
  const switchTab = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="campaignpreviewheader">
      <div className="leftSide">
        <div className="campaignTitle">
          {title}
          {' '}
        </div>
        <div className="saveCampdraftbutton">
          <Button>
            <span className="savedrafttext">{BtnContent}</span>
          </Button>
        </div>
      </div>
      {renderMenu()}
      <div className="centerSide">
        <div className="headingBox align-center">
          <Tabs
            tabs={tabs}
            className="headingBox__tabs"
            onChange={switchTab}
          />
        </div>
      </div>
      <div className="rightSide">
        <ul className="iconList">
          <div className="cancelbutton">
            <Button>
              <span className="edittext">{BtnRightContent}</span>
            </Button>
          </div>
        </ul>
      </div>
    </div>
  );
};
CampaignsPreviewHeader.propTypes = {
  title: PropTypes.string.isRequired,
  BtnContent: PropTypes.string.isRequired,
  BtnRightContent: PropTypes.string.isRequired
};
export default CampaignsPreviewHeader;
