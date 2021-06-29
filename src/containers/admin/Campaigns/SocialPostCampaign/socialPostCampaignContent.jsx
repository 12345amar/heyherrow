import React, { useState, useEffect } from 'react';
import './index.scss';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import Loader from 'react-loader-spinner';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import InstagramLogin from '../../../../components/SocialLogin/Instagram/Login';
import Facebook from '../../../../assets/Icons/Header/Icon/Facebook.svg';
import Instagram from '../../../../assets/Icons/Header/Icon/Instagram.svg';
import Twitter from '../../../../assets/Icons/Header/Icon/Twitter.svg';
import LinkedInIcon from '../../../../assets/Icons/Header/Icon/LinkedIn.svg';
import SnapChat from '../../../../assets/Icons/Header/Icon/SnapChat.svg';
import { LinkedIn } from '../../../../components/SocialLogin/LinkedIn';
import { facebookLinkedLibrary } from '../../../../redux/actions';
import { API_MARKETING, ACCESS_TOKEN } from '../../../../constants';

const SocialPostCampaignContent = (props) => {
  const { campaignFormData } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const [profileCheckList, setProfileCheckList] = React.useState([]);
  const [change, setChange] = useState(false);
  const [socialMediaType, setSocialMediaType] = useState(campaignFormData && campaignFormData.linkedLibraries ? campaignFormData.selectedSocialMediaType : 'facebook');
  const [campaignManager, setcampaignManager] = React.useState([]);
  const [IntervalId, setIntervalId] = useState(0);
  const [pageFetch, setpageFetch] = useState(false);

  const CampaignManagerResponse = () => {
    axios
      .get(`${API_MARKETING}/campaign-manager`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`
        }
      })
      .then((response) => setcampaignManager(response.data));
  };
  const selectMediaType = (type) => {
    setSocialMediaType(type);
  };
  const CallPagesApi = () => {
    if (campaignFormData && campaignFormData.type === 'social_post') {
      axios
        .get(`${API_MARKETING}/socialmedia-page-list`, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`
          }
        })
        .then((res) => {
          if (campaignFormData && campaignFormData.selectedSocialMediaType) {
            if (socialMediaType === 'facebook') {
              res.data.facebook.map((item) => {
                if (
                  item.page_id === campaignFormData.linkedLibraries.facebook[0]
                ) {
                  const selectedItem = item;
                  selectedItem.isSelected = true;
                }
                return item;
              });
            } else if (socialMediaType === 'linkedin') {
              res.data.linkedin.map((item) => {
                if (
                  item.page_id === campaignFormData.linkedLibraries.linkedin[0]
                ) {
                  const selectedItem = item;
                  selectedItem.isSelected = true;
                }
                return item;
              });
            }
          }
          setProfileCheckList(res.data);
          if (res.data.length !== 0 && res.data.linkedin.length !== 0) {
            setpageFetch(false);
            selectMediaType('linkedin');
          }
        });
    } else if (campaignFormData && campaignFormData.type === 'social_ad') {
      axios
        .get(`${API_MARKETING}/adAccounts`, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`
          }
        })
        .then((res) => {
          if (campaignFormData && campaignFormData.selectedSocialMediaType) {
            if (socialMediaType === 'facebook') {
              res.data.facebook.map((item) => {
                if (
                  item.account_id
                  === campaignFormData.linkedLibraries.facebook[0]
                ) {
                  const selectedItem = item;
                  selectedItem.isSelected = true;
                }
                return item;
              });
            } else if (socialMediaType === 'linkedin') {
              res.data.linkedin.map((item) => {
                if (
                  item.account_id
                  === campaignFormData.linkedLibraries.linkedin[0]
                ) {
                  const selectedItem = item;
                  selectedItem.isSelected = true;
                }
                return item;
              });
            }
          }
          setProfileCheckList(res.data);
          if (res.data.length !== 0 && res.data.linkedin.length !== 0) {
            setpageFetch(false);
            selectMediaType('linkedin');
          }
        });
    }
  };
  useEffect(() => {
    CampaignManagerResponse();
    if (campaignFormData && campaignFormData.selectedSocialMediaType) {
      CallPagesApi();
    }
  }, []);
  const handleChange = (item) => {
    let Data = [];
    if (socialMediaType === 'instagram') {
      Data = profileCheckList.instagram;
    } else if (socialMediaType === 'facebook') {
      Data = profileCheckList.facebook;
    } else if (socialMediaType === 'linkedin') {
      Data = profileCheckList.linkedin;
    } else if (socialMediaType === 'twitter') {
      Data = profileCheckList.twitter;
    } else if (socialMediaType === 'snapchat') {
      Data = profileCheckList.snapchat;
    }
    const newData = Data.filter((page) => {
      const selecedPage = page;
      if (selecedPage.page_id === item.page_id) {
        if (selecedPage.isSelected) {
          selecedPage.isSelected = false;
        } else {
          selecedPage.isSelected = true;
        }
      } else {
        const unSelectedPage = page;
        unSelectedPage.isSelected = false;
        return unSelectedPage;
      }
      return selecedPage;
    });
    if (socialMediaType === 'instagram') {
      profileCheckList.instagram = newData;
    } else if (socialMediaType === 'facebook') {
      profileCheckList.facebook = newData;
    } else if (socialMediaType === 'linkedin') {
      profileCheckList.linkedin = newData;
    } else if (socialMediaType === 'twitter') {
      profileCheckList.twitter = newData;
    } else if (socialMediaType === 'snapchat') {
      profileCheckList.snapchat = newData;
    }
    setProfileCheckList(profileCheckList);
    setChange(!change);
  };

  const handleonChange = (item) => {
    let Data = [];
    if (socialMediaType === 'instagram') {
      Data = profileCheckList.instagram;
    } else if (socialMediaType === 'facebook') {
      Data = profileCheckList.facebook;
    } else if (socialMediaType === 'linkedin') {
      Data = profileCheckList.linkedin;
    } else if (socialMediaType === 'twitter') {
      Data = profileCheckList.twitter;
    } else if (socialMediaType === 'snapchat') {
      Data = profileCheckList.snapchat;
    }
    const newData = Data.filter((page) => {
      const selecedPage = page;
      if (selecedPage.account_id === item.account_id) {
        if (selecedPage.isSelected) {
          selecedPage.isSelected = false;
        } else {
          selecedPage.isSelected = true;
        }
      } else {
        const unSelectedPage = page;
        unSelectedPage.isSelected = false;
        return unSelectedPage;
      }
      return selecedPage;
    });
    if (socialMediaType === 'instagram') {
      profileCheckList.instagram = newData;
    } else if (socialMediaType === 'facebook') {
      profileCheckList.facebook = newData;
    } else if (socialMediaType === 'linkedin') {
      profileCheckList.linkedin = newData;
    } else if (socialMediaType === 'twitter') {
      profileCheckList.twitter = newData;
    } else if (socialMediaType === 'snapchat') {
      profileCheckList.snapchat = newData;
    }
    setProfileCheckList(profileCheckList);
    setChange(!change);
  };

  const onClickNext = () => {
    clearInterval(IntervalId);
    let Data = [];
    if (socialMediaType === 'instagram') {
      Data = profileCheckList.instagram;
    } else if (socialMediaType === 'facebook') {
      Data = profileCheckList.facebook;
    } else if (socialMediaType === 'linkedin') {
      Data = profileCheckList.linkedin;
    } else if (socialMediaType === 'twitter') {
      Data = profileCheckList.twitter;
    } else if (socialMediaType === 'snapchat') {
      Data = profileCheckList.snapchat;
    }
    const selectedData = [];
    if (campaignFormData && campaignFormData.type === 'social_post') {
      if (Data && Data.length > 0) {
        Data.map((item) => {
          if (item.isSelected) {
            selectedData.push(item.page_id);
          }
          return null;
        });
      }
    }
    if (campaignFormData && campaignFormData.type === 'social_ad') {
      Data.map((item) => {
        if (item.isSelected) {
          selectedData.push(item.account_id);
        }
        return null;
      });
    }
    if (selectedData.length !== 0) {
      const selectedLibrary = {
        selectedSocialMediaType: socialMediaType,
        linkedLibraries: {
          socialMediaType,
          [socialMediaType]: selectedData,
        },
        campaignManagerApiData: campaignManager
      };
      dispatch(facebookLinkedLibrary(selectedLibrary));
      if (socialMediaType === 'facebook') {
        history.push('/admin/campaigns/new/facebookCampaign');
      } else {
        history.push('/admin/campaigns/new/UndiffirentiatedCampaign');
      }
    } else {
      toast.error('Please choose atleast one record');
    }
  };

  function SocialToken(Id, _token) {
    return axios
      .post(`${API_MARKETING}/tokens`, { campaignManagerId: Id, token: _token }, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`
        }
      })
      .then((res) => res)
      .catch((error) => error);
  }

  const responseFacebook = (response) => {
    selectMediaType('facebook');
    toast.info(response);
    // let CampiagnMngId = 0;
    // campaignManager.campaignManagerData.filter((item) => {
    //   if (item.name === 'facebook') {
    //     CampiagnMngId = item.id;
    //   }
    //   return item.id;
    // });
    // SocialToken('1', 'facebook', response).then((fbResponse) => {
    //   console.log(fbResponse);
    // });
  };
  const handleSuccess = (data) => {
    const config = {
      method: 'get',
      url: `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&client_id=86v53knx8uv2qx&client_secret=FwhhMmY4QlqyDMba&code=${data.code}&redirect_uri=${window.location.origin}/admin/linkedin`,
    };
    axios(config)
      .then((response) => {
        const LNR = response.data;
        let CampiagnMngId = 0;
        campaignManager.campaignManagerData.filter((item) => {
          if (item.name === 'linkedin') {
            CampiagnMngId = item.id;
          }
          return item.id;
        });
        SocialToken(CampiagnMngId, LNR.access_token).then((lnRes) => {
          if (lnRes !== null) {
            if (lnRes.data.statusCode === 200) {
              setpageFetch(true);
              const intervalId = setInterval(CallPagesApi, 20000);
              setIntervalId(intervalId);
              document.getElementById('hdnIntervalId').value = intervalId;
            }
          }
        });
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleFailure = (error) => {
    toast.error(error);
  };

  const responseInstagram = (response) => {
    toast.info(response);
    selectMediaType('instgram');
    // SocialToken('1', 'instgram', '').then((InResponse) => {
    //   console.log(InResponse);
    // });
  };

  const renderCheckboxList = (options) => {
    if (campaignFormData && campaignFormData.type === 'social_post') {
      return (
        <div className="checkbox_list">
          {
            options.map((item) => (
              <div className="checkbox_item" onClick={() => { handleChange(item); }} key={item.id}>
                <label htmlFor="conatinerLabel" className="container">
                  <input
                    type="checkbox"
                    name={item.page_name}
                    checked={item.isSelected}
                  />
                  <span className="checkmark" />
                  {item.page_name}
                  {clearInterval(IntervalId)}
                </label>
              </div>
            ))
          }
        </div>
      );
    }

    return (
      <div className="checkbox_list">
        {
          options.map((item) => (
            <div className="checkbox_item" onClick={() => { handleonChange(item); }}>
              <label htmlFor="conatinerLabel" className="container">
                <input
                  type="checkbox"
                  name={item.account_name}
                  checked={item.isSelected}
                />
                <span className="checkmark" />
                {item.account_name}
                {clearInterval(IntervalId)}
              </label>
            </div>
          ))
        }
      </div>
    );
  };

  const renderLinkedAccounts = () => {
    if (profileCheckList.length !== 0) {
      clearInterval(IntervalId);
    }
    if (socialMediaType === 'facebook' && profileCheckList && profileCheckList.facebook) return renderCheckboxList(profileCheckList.facebook);
    if (socialMediaType === 'instagram' && profileCheckList && profileCheckList.instagram) return renderCheckboxList(profileCheckList.instagram);
    if (socialMediaType === 'linkedin' && profileCheckList && profileCheckList.linkedin) return renderCheckboxList(profileCheckList.linkedin);
    if (socialMediaType === 'twitter' && profileCheckList && profileCheckList.twitter) return renderCheckboxList(profileCheckList.twitter);
    if (socialMediaType === 'snapchat' && profileCheckList && profileCheckList.snapchat) return renderCheckboxList(profileCheckList.snapchat);
    return null;
  };

  return (
    <>
      <div className="social_flex">
        <input id="hdnIntervalId" name="hdnIntervalId" type="hidden" />
        <input id="hdnIntervalCount" name="hdnIntervalCount" type="hidden" value="0" />
        <span
          className={socialMediaType === 'facebook' ? 'facebook' : 'facebook blurImage'}
          onClick={() => { selectMediaType('facebook'); }}
        >
          <FacebookLogin
            appId="910428652830113"
            callback={responseFacebook}
            fields="name,email,picture"
            scope="public_profile,pages_read_engagement,pages_manage_posts,pages_read_user_content"
            render={(renderProps) => (
              <img onClick={renderProps.onClick} src={Facebook} alt="Login with FB" />
            )}
          />
        </span>
        <span
          className={socialMediaType === 'instagram' ? 'instagram' : 'instagram blurImage'}
          onClick={() => { selectMediaType('instagram'); }}
        >
          <InstagramLogin
            clientId="5fd2f11482844c5eba963747a5f34556"
            onSuccess={responseInstagram}
            onFailure={responseInstagram}
            redirectUri={window.location.href}
            render={({ onClick }) => (
              <img onClick={onClick} src={Instagram} alt="Log in with Facebook" style={{ maxWidth: '180px', cursor: 'pointer' }} />
            )}
          />
        </span>

        <LinkedIn
          clientId="86v53knx8uv2qx"
          redirectUri={`${window.location.origin}/admin/linkedin`}
          scope="r_basicprofile,r_organization_social,r_1st_connections_size,r_ads_reporting,rw_organization_admin,r_ads,rw_ads,w_member_social,w_organization_social"
          state="34232423"
          onFailure={handleFailure}
          onSuccess={handleSuccess}
          supportIE
          redirectPath="/admin/linkedin"
          className={socialMediaType === 'linkedin' ? 'linkedin' : 'linkedin blurImage'}
        >
          <img src={LinkedInIcon} alt="Log in with Linked In" />
        </LinkedIn>

        <span
          className={socialMediaType === 'twitter' ? 'twitter' : 'twitter blurImage'}
          onClick={() => { selectMediaType('twitter'); }}
        >
          <img src={Twitter} alt="" />
        </span>
        <span
          className={socialMediaType === 'snapchat' ? 'snapchat' : 'snapchat blurImage'}
          onClick={() => { selectMediaType('snapchat'); }}
        >
          <img src={SnapChat} alt="" />
        </span>
      </div>
      <div className="social_post_select">
        <span className="social_post_select_text">Select from your linked accounts below</span>
      </div>

      <div className="social_post_group">
        <div className="social_post_group_one">
          {pageFetch
            ? (
              <div className="pageLoader">
                {campaignFormData.type === 'social_post' ? 'Please wait pages are fetching...' : 'Please wait accounts are fetching...'}
                <br />
                <Loader
                  type="Oval"
                  color="#008080"
                  height={30}
                  width={30}
                />
              </div>
            )
            : null}
          {renderLinkedAccounts()}
        </div>
      </div>

      <div className="socialpostnextbutton">
        <Button onClick={() => { onClickNext(); }}>
          <span className="socialpostnexttext">Next</span>
        </Button>
      </div>

    </>
  );
};

SocialPostCampaignContent.propTypes = {
  campaignFormData: PropTypes.objectOf(PropTypes.any),
};

SocialPostCampaignContent.defaultProps = {
  campaignFormData: {},
};

export default SocialPostCampaignContent;
