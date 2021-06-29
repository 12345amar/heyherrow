/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { get } from 'lodash';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import CustomIcon from '../../../components/common/CustomIcon';
import TeamReportTable from '../../../components/common/TeamReportTable';
import './index.scss';
import ProfileInitial from '../../../components/common/ProfileInitials';
import { getMemberSalesRepData, getSideBarSalesRep } from '../../../api/adminTeam';
import SideTabsComponent from '../../../components/common/SideTabsComponent';
import HeaderDropDown from '../../../components/common/HeaderDropDown';
import StatsCard from '../../../components/common/StatsCard';
import SideDrawer from '../../../components/cards/SideDrawer';

const bottomTabs = [
  'Team',
  'Customers',
  'Shared',
  'Quoted',
  'Sold',
  'Closed',
];

const durationTab = ['Monthly', 'Quarterly','Yearly'];

function TeamDetail(props) {
  const {
    match: {
      params: { id },
    },
  } = props;
  const [activeTab, setActiveTab] = useState(2);
  const [activeStateTab, setActiveStateTab] = useState(0);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 100,
    status: 'team',
    duration:new Date().getFullYear(),
    durationType: 'yearly',
    search: '',
    member: id,
  });
  const {
    dispatch,
    adminTeamSideDetails,
    adminTeamMemberData
  } = props;

  const onChangeTab = (currentTab) => {
    setActiveTab(currentTab);
    let durationType = 'yearly';
    let defaultDuration = new Date().getFullYear();
    let value = parseInt(currentTab.target.value, 10);
    switch (value) {
      case 0: return {
        duration: 'monthly',
        defaultDuration: '1'
      };
      case 1: return {
        duration: 'quarterly',
        defaultDuration: '1'
      };
      case 2: return {
        duration: 'yearly',
        defaultDuration: 'all'
      };
      default:
        break;
      }
      return filterHandler({ durationType, duration: defaultDuration });
  };
 
  useEffect(() => {
    // dispatch(getMemberStateProductData(filters.member));
    dispatch(getMemberSalesRepData(filters.status, filters.durationType, filters.duration, filters.page, filters.member));
    dispatch(getSideBarSalesRep(id));
  }, []);

  const filterHandler = (items) => {
    const newFilter = { ...filters, page: 1, ...items };
    setFilters(newFilter);
    dispatch(getMemberSalesRepData(newFilter.status, newFilter.durationType, newFilter.duration, newFilter.page, newFilter.member));
  };

  const onSelectMemeberFilter = (e) => {
    filterHandler({ member: e.target.value });
  };

  const onChangeDuration = (e) => {
    const { value } = e.target;
    filterHandler({ duration: value });
  };

  const onStateChangeTab = (currentTab = 0) => {
    setActiveStateTab(currentTab);
    let status = '';
    switch (currentTab) {
      case 0:
        status = 'team';
        break;
      case 1:
        status = 'customers';
        break;
      case 2:
        status = 'shared';
        break;
      case 3:
        status = 'quoted';
        break;
      case 4:
        status = 'sold';
        break;
      case 5:
        status = 'closed';
        break;
      default:
        status = 'team';
        break;
    }
    filterHandler({ status: status });
  };
  return (
    <>
      <div className="contentContainerFull teamDescription fullHeight teamDetails">
        <div className="innerFullCon leftSideBar">
          <div className="product-head-title customer-title-head">
            <Link to="/admin/team"><i class="fa fa-angle-left" aria-hidden="true"></i></Link><h4>All Team Members</h4>
          </div>
          <div className="tableBox">
            <ul className="listCon timeLineContainer">
              <li className="listItem active">
                <div className="userCard">
                  <div style={{position: 'relative', zIndex: 9}}>
                    <ProfileInitial 
                    firstName={get(adminTeamSideDetails.user, 'firstName', '')} 
                    lastName={get(adminTeamSideDetails.user, 'lastName', '')} 
                    size="medium" 
                    profileId={get(adminTeamSideDetails.user, 'id', '')}
                    profileUrl={adminTeamSideDetails?.user?.profileUrl}
                    />
                  </div>
                  {adminTeamSideDetails && adminTeamSideDetails.user && adminTeamSideDetails.user.reportingTo ?
                    <div style={{position: 'absolute', top: 0, left: 20}}>
                      <ProfileInitial 
                      firstName={get(adminTeamSideDetails.user.reportingTo, 'firstName', '')} 
                      lastName={get(adminTeamSideDetails.user.reportingTo, 'lastName', '')} 
                      size="medium" 
                      profileId={get(adminTeamSideDetails.user.reportingTo, 'id', '')}
                      profileUrl={adminTeamSideDetails?.user?.reportingTo?.profileUrl}
                      />
                    </div>
                  : null}
                  {filters.status === 'team' ?
                    <UncontrolledDropdown className="moreOptionsCon">
                      <DropdownToggle className="moreLeads">
                        <button className="sendBtn">
                          <CustomIcon icon="Header/Icon/More" />
                        </button>
                      </DropdownToggle>
                      <DropdownMenu>
                        <NavLink to={`/admin/team-permission/${id}`}>
                          <DropdownItem>
                            Permission
                          </DropdownItem>
                        </NavLink>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  : null}
                </div>
                <div className="userName">
                  <h4>
                    {`${get(adminTeamSideDetails.user, 'firstName', '')} ${get(
                      adminTeamSideDetails.user,
                      'lastName',
                      ''
                    )}`}
                  </h4>
                  <p>{`${get(adminTeamSideDetails && adminTeamSideDetails.user && adminTeamSideDetails.user.role, 'name', '')}`}</p>
                  <ul className="userActions">
                    <li>
                      <a href={`mailto:${get(adminTeamSideDetails.user, 'email', '')}`}>
                        <CustomIcon icon="Icon/Email" />
                      </a>
                    </li>
                    <li>
                      <Link to={`/admin/chats/users/${adminTeamSideDetails && adminTeamSideDetails.user && adminTeamSideDetails.user.id}`}>
                        <CustomIcon icon="Icon/Chat Regular" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
            <div className="cardHeader noborder">
              <div className="bottomTabs">
                <SideTabsComponent
                  activeTab={activeStateTab}
                  tabs={bottomTabs}
                  noRightSection
                  onChangeTab={onStateChangeTab}
                  totalCount={adminTeamSideDetails && adminTeamSideDetails}
                  showOtherOptions={true}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="innerFullCon rightSection">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div className="TeamSideTitle">
              <h1>
                {filters.status}
              </h1>
            </div>
            <div className="cardHeader noborder lessPadding">
              <div className="topActionBar" style={{ right: 5 }}>
                {filters.status !== 'team' && filters.status !== 'customers' ?
                  <div className="bottomTabs">
                    <div className="searchTabs selecBox TeamMemberDrop" style={{margin: 0}}>
                      <select
                        className="form-control"
                        onChange={onSelectMemeberFilter}
                      >
                        <option value="">All Members</option>
                        <option value="1">Member 1</option>
                        <option value="2">Member 2</option>
                        <option value="3">Member 3</option>
                      </select>
                    </div>
                    <HeaderDropDown
                      activeTab={activeTab}
                      tabs={durationTab}
                      renderSelect
                      renderSelectOnRight
                      onChangeTab={onChangeTab}
                      onChangeDuration={onChangeDuration}
                    />
                  </div>
                : null}
                {filters.status === 'team' ?
                  <div style={{marginLeft: 10}}>
                    <SideDrawer />
                  </div>
                : null}
              </div>
            </div>
          </div>
          {filters.status !== 'team' && filters.status !== 'customers' ?
            <div
              className="detailCards overviewCards"
              style={{ marginTop: 20, marginBottom: 20 }}
            >
              <div className="flex justify-between stats-group">
                <StatsCard
                  label="REVENUE"
                  value={adminTeamMemberData.salesData?.volume || 0}
                  type="currency"
                />
                <StatsCard
                  label="AVG. TURN"
                  value={adminTeamMemberData.salesData?.avgTurn || 0}
                  type="day"
                />
              </div>
              <div className="flex justify-between stats-group">
                <StatsCard
                  label="UNITS"
                  value={adminTeamMemberData.salesData?.units || 0}
                />
                <StatsCard
                  label="EST. MARGIN"
                  value={adminTeamMemberData.salesData?.estMargin || 0}
                  type="currency"
                />
              </div>
            </div>
          : null}
          <div className="tableBox">
            {adminTeamMemberData && adminTeamMemberData && (
              <TeamReportTable
                filters={filters}
                data={adminTeamMemberData || []}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  teamStateData: state.team.teamStateData,
  teamSales: state.team.teamSales,
  teamSalesRepLoader: state.team.teamSalesRepLoader,
  teamStateLoader: state.team.teamStateLoader,
  adminTeamSideDetails: state.adminTeam.adminTeamSideDetails,
  adminTeamMemberData: state.adminTeam.adminTeamMemberData,
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(TeamDetail);
