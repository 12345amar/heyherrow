import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.scss';
import Loader from 'react-loader-spinner';
import { useHistory } from 'react-router-dom';
import CampaignsAll from './CampaignsAll';
import CampaignType from './CampaignType';
import { ACCESS_TOKEN, API_MARKETING } from '../../../constants';

export const DataContext = React.createContext({});

const Campaigns = () => {
  const [apiResponse, setApiResponse] = useState([]);
  const history = useHistory();
  const CallListApi = () => {
    setApiResponse([]);
    axios
      .get(`${API_MARKETING}/list?page=1&limit=10`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`
        }
      })
      .then((response) => {
        if (response.data.campaignList.length > 0) {
          setApiResponse(response.data.campaignList);
        } else {
          history.push('/admin/campaigns/new');
        }
      });
  };
  useEffect(() => {
    CallListApi();
  }, []);
  const responseCampain = (campaign) => (
    campaign.length > 0
      ? <CampaignsAll Apicall={CallListApi} CampaignData={campaign} />
      : <CampaignType />
  );
  return (
    <DataContext.Provider value={apiResponse}>
      <div className="campaign-container center-box">
        {apiResponse.length === 0 ? (
          <Loader
            type="Oval"
            color="#008080"
            height={30}
            width={30}
            className="LoaderSpinner"
          />
        ) : responseCampain(apiResponse)}
      </div>
      <div style={{ borderBottom: '20px solid #f2f3f5', position: 'sticky', bottom: 0 }} />
    </DataContext.Provider>
  );
};
export default Campaigns;
