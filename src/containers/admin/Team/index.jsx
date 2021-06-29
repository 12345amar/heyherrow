/* eslint-disable */

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import SearchInput from '../../../components/common/SearchInput';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal, ModalBody
} from 'reactstrap';
import { connect, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
// import {
//   getTeam,
//   getDepartments,
//   assignDepartment,
//   reInvite,
//   cancelInvite,
// } from '../../api/team';
import InfiniteScroll from 'react-infinite-scroller';
import Loader from 'react-loader-spinner';
// import {
//   addNewTeam,
//   removeNewTeam,
//   onChangeTeam,
//   clearTeams,
// } from '../../actions/team';
// import {
//   addTeam,
//   updateTeam,
//   archivedTeam,
//   multipleArchivedTeams,
//   assignReportTo,
//   getRoles,
//   updateUserDepartment,
// } from '../../api/team';
import { toast } from 'react-toastify';
import { debounce, clone } from 'lodash';
import TableContent from '../../../components/common/ContentsTable';
import CustomIcon from '../../../components/common/CustomIcon';
import Departments from '../../../components/common/Departments';
import TableSendButton from '../../../components/common/TableSendButton';
import './index.scss';
import { getDepartmentList, getAllDepartmentUserList, createTeamUser, updateTeamUser, deactivateUser, getDeactivatedUser, activateUser, inviteTeamUser, cancelUserInvitation } from '../../../api/adminTeam';
import { getRolesList } from '../../../api';
import { addNewTeamMember, onChangeTeam, removeNewTeam } from '../../../redux/actions';
import { setLocale } from 'yup';

let columns = [
  { label: 'First name', key: 'firstName', hasInitials: true },
  { label: 'Last name', key: 'lastName' },
  { label: 'Email address', key: 'email', type: 'email', isEmail: true},
  {
    label: 'Department',   
    key: 'departments',
    type: 'department',
    options: 'departmentCode',
  },
  { label: 'Role', key: 'roleId', options: 'roleCode', type: 'role' },
  {
    label: 'Phone number',
    key: 'phoneNumber',
    type: 'phone',
    options: 'phoneCode',
  },
  { label: 'State', key: 'stateId', type: 'state', options: 'stateCode' },
  { label: 'City', key: 'cityId', type: 'city', options: 'cityCode' },
  { label: 'Zip code', key: 'zipcode', value: '', type: 'zipcode' },
  { label: 'Reporting to', key: 'reportingTo', type: 'reportTo', minWidth: 150, },
  { label: 'Created on', key: 'updatedAt', type: 'date', readOnly: true },
];

let deactivatedColumns = [
  { label: 'First name', key: 'firstName', hasInitials: true },
  { label: 'Last name', key: 'lastName' },
  { label: 'email address', key: 'email', type: 'email', isEmail: true },
  {
    label: 'Department',
    key: 'departments',
    type: 'department',
    options: 'departmentCode',
  },
  { label: 'Role', key: 'roleId', options: 'roleCode', type: 'role' },
  {
    label: 'Phone number',
    key: 'phoneNumber',
    type: 'phone',
    options: 'phoneCode',
  },
  { label: 'State', key: 'stateId', type: 'state', options: 'stateCode' },
  { label: 'City', key: 'cityId', type: 'city', options: 'cityCode' },
  { label: 'Zip code', key: 'zipcode', value: '',type: 'zipcode' },
  { label: 'Reporting to', key: 'reportingTo', type: 'reportTo', minWidth: 150, },
  { label: 'Deactivated on', key: 'updatedAt', type: 'date', readOnly: true },
];

const formObject = {
  isNewItem: true,
  firstName: '',
  lastName: '',
  email: '',
  departments: '',
  phoneNumber: '',
  countryCode: '1',
  roleId: '',
  role: '',
  stateId: '',
  cityId: '',
  zipcode: '',
  reportingTo: '',
  updatedAt: '',
};

const phoneCode = [
  { label: 'India', value: 1, country_code: 'IN', code: '91' },
  { label: 'UK', value: 2, country_code: 'GB', code: '255' },
  { label: 'USA', value: 3, country_code: 'US', code: '1' },
  { label: 'Australia', value: 4, country_code: 'AU', code: '251' },
];

function Team(props) {
  const [loading, setloading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingSidebar, setloadingSidebar] = useState(false);
  const [filter, setFilter] = useState('all');
  const [saving, setSaving] = useState(false);
  const [selectedRows, setSelectedRow] = useState([]);
  const [search, setSearch] = useState('');
  const [isLocked, setIsLocked] = useState(true);
  const [modal, setModal] = useState(false);
  const [disableUser, setDeactivateUser] = useState(null);
  const [height, setHeight] = useState(window.innerHeight);
  const [limit] = useState(30);
  const dispatch = useDispatch();
  const {
    match: {
      params: { id },
    },
  } = props;

  const {
    countries, states, cities, users, adminTeamDepartmentList, adminAllTeamDepartment, roleList, adminDeactivatedUsers
  } = props;
  console.log(adminTeamDepartmentList);
  useEffect(() => {
    fetchDepartments();
    fetchRoles();
  }, []);

  useEffect(() => {
    if(id === 'deactivate') {
      dispatch(getDeactivatedUser(''));
      setloading(false);
      setHasMore(false);
    }
    else {
      setFilter(id || 'all');
      fetchTeam(id, page, '');
      setHeight(window.innerHeight);
    }
  }, [id]);

  const fetchRoles = () => {
    dispatch(getRolesList());
  };

  const selectMultipleRowHandler = (id) => {
    const _selectedRows = Object.assign([], selectedRows);
    const index = _selectedRows.findIndex((o) => o === id);
    if (index >= 0) {
      _selectedRows.splice(index, 1);
    } else {
      _selectedRows.push(id);
    }
    setSelectedRow(_selectedRows);
  };

  /*
   * Getting Team list
   */
  const fetchTeam = (currentFilter, currentPage, searchText) => {
    // currentFilter = currentFilter ? currentFilter : filter;
    // currentPage = currentPage ? currentPage : page;
    // searchText = searchText ? searchText : currentSearchText;
    setloading(true);
    dispatch(getAllDepartmentUserList(
    height >= 900 ? (limit*3): limit,
    currentFilter && `${currentFilter}`, 
    currentPage, 
    searchText && `${searchText}`))
    .then((res) => {
        setloading(false);
        if (res.length < 30) {
          setHasMore(false);
          setSearch('');
        } else {
          setHasMore(true);
          setPage(page + 1);
          setSearch('');
        }
      });
  };

  const fetchDepartments = () => {
    setloadingSidebar(true);
    dispatch(getDepartmentList()).then(() => {
      setloadingSidebar(false);
    });
  };

  /*
   * Add new data row for Team
   */
  const addNew = () => {
    dispatch(addNewTeamMember(JSON.parse(JSON.stringify({ 
      ...clone(formObject), 
        createdAt: new Date() 
      }))));
  };

  const loadFunc = () => {
    if (!loading) {
      fetchTeam(id, page, '');
    }
  };

  const removeRow = (index) => {
    dispatch(removeNewTeam(index));
  };

  const onSave = (row, index, payload, button) => {
    let item = row;
    if (item.id) {
      setSaving(true);
      item = {
        ...row,
      };
      dispatch(updateTeamUser(item.id, payload)).then(() => {
        setSaving(false);
      });
    } else {
      if (button) {
        const obj = {
          ...item,
        };
        setSaving(true);
        dispatch(createTeamUser(item, index))
          .then((res) => {
            if (!res.errors) {
            }
            setSaving(false);
          })
          .catch(() => {});
      }
    }
  };

  const assignReportToHandler = (customer_id, rep_to_id) => {
    const changeSalesRep = users && users.find((data) => rep_to_id == data.id);
    const dataToBeSent = { 
      reportingToId: rep_to_id,
      reportingTo: {
        id: rep_to_id,
        firstName: changeSalesRep.firstName,
        lastName: changeSalesRep.lastName,
        email: changeSalesRep.email,
      } 
    };

    setSaving(true);
    dispatch(updateTeamUser(customer_id, dataToBeSent))
      .then(() => {
        setSaving(false);
        toast.success('ReportingTo assigned successfully.');
      })
      .catch(() => {
        setSaving(false);
      });
  };

  const toggle = () => {
    setModal(!modal);
  };

  const showModal = (e,item) => {
    e.stopPropagation();
    setModal(!modal);
    setDeactivateUser(item);
  }

  const reactivateTeamMember = (e, item) => {
    e.stopPropagation();
    onActivate(item);
  }

  const inviteTeamMember = (e, item) => {
    e.stopPropagation();
    dispatch(inviteTeamUser(item.id, item)).then((res) => {
      toast.success('Team member invite successfully.');
    });
  };

  const cancelInviteMember = (e, item) => {
    e.stopPropagation();
    dispatch(cancelUserInvitation(item.id, item)).then((res) => {
      toast.success('Team member invite cancelled successfully.');
    });
    props.history.push(`/admin/team/deactivate`);
  }

  /*
   * Table actions for Team.
   */
  const renderTableActions = (item) => {
    return (
      <div className="table-actions">
        {item.inviteStatus === 'pending' ?
          <button className="sendBtn">
            <UncontrolledDropdown className="moreOptionsConnew" direction="left">
              <DropdownToggle className="moreLeads" onClick={(e)=> e.stopPropagation()}>
                <button className="sendBtn">
                  <CustomIcon 
                  icon="alert/warning-yellow" />
                </button>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={(e) => inviteTeamMember(e, item)}>
                <CustomIcon icon="Send" />Resend Invite
                </DropdownItem>
                <DropdownItem onClick={(e) => cancelInviteMember(e, item)}>
                <CustomIcon icon="Delete" />Cancel Invite
                </DropdownItem>
              </DropdownMenu >
            </UncontrolledDropdown>
          </button> 
        : <>
          <button className="sendBtn">
            <UncontrolledDropdown className="moreOptionsConnew" direction="left">
              <DropdownToggle className="moreLeads" onClick={(e)=> e.stopPropagation()}>
                <button className="sendBtn">
                  <CustomIcon icon="Header/Icon/More" />
                </button>
              </DropdownToggle>
              <DropdownMenu>
                {id !== 'deactivate' ? 
                <DropdownItem onClick={(e) => showModal(e,item)}>
                    <CustomIcon icon="Icon/Archive" />Deactivate
                  </DropdownItem>
                : <DropdownItem onClick={(e) => reactivateTeamMember(e, item)}>
                  <CustomIcon icon="Icon/Archive" />Reactivate
                </DropdownItem>}
              </DropdownMenu>
            </UncontrolledDropdown>
          </button>
          <button
            className="sendBtn"
            onClick={() => props.history.push(`/admin/team-details/${item.id}`)}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </>}
      </div>
    );
  };

  const onChange = (e, key, item, index) => {
    const value = e.target.value;
    if (key === 'departments') {
      dispatch(onChangeTeam([value], key, item, index));
      return;
    }

    if (key === 'stateId') {
      dispatch(onChangeTeam(value, key, item, index));
      dispatch(onChangeTeam('', 'cityId', item, index));
    }
    dispatch(onChangeTeam(value, key, item, index));
  };

  const filterTeam = async (currentFilter) => {
    setHasMore(true);
    setPage(1);
    props.history.push(`/admin/team/${currentFilter}`);
  };

  const debouncedSave = useCallback(
    debounce((nextValue) => {
      setSearch(nextValue);
      fetchTeam(filter, 1, nextValue);
    }, 500),
    [] // will be created only once initially
  );

  const handleChange = (event) => {
    setPage(1);
    setSearch(event);
    // highlight-starts
    debouncedSave(event);
    // highlight-ends
  };

  const saveBtn = (item, index) => {
    const isDisabled = () => {
      return (
        !item.firstName ||
        !item.lastName ||
        !item.email ||
        !item.roleId ||
        !item.departments.length
      );
    };
    return (
      <button
        disabled={isDisabled()}
        className="sendBtn send-invite-team"
        onClick={() => onSave(item, index, null, true)}
        title="Send an invite"
        placement="left"
      >
        <CustomIcon icon="airplane" />
      </button>
    );
  };

  const onDeactivate = () => {
    const data = {
      ids: [disableUser.id],
    }
    dispatch(deactivateUser(data)).then((res) => {
      toast.success('Team member deactivated successfully.');
      toggle();
      setDeactivateUser(null);
    });
  };

  const onActivate = (item) => {
    const data = {
      ids: [item.id],
    }
    dispatch(activateUser(data)).then((res) => {
      toast.success('Team member Reactivated successfully.');
      dispatch(getDeactivatedUser(''));
    });
  };

  const onRowClick = (item) => {
    if(item.inviteStatus !== 'pending') {
      props.history.push(`/admin/team-details/${item.id}`);
    }
  }

  return (
    <>
      <div className="contentContainerFull teamDescription teamList">
        <div className="innerFullCon leftSideBar">
          <Departments
            {...props}
            loading={loadingSidebar}
            filterTeam={filterTeam}
            filter={filter}
          />
        </div>
        <div className="innerFullCon rightSection">
          <div className="cardHeader noborder">
            <h4>{id === 'deactivate' ? 'Deactivated Team Members' : 'All Team Members'}</h4>
            <div className="topActionBar">
              {selectedRows.length > 0 && (
                <button className="btn">
                  Deactivate All
                </button>
              )}
              <SearchInput
                onChange={(e) => handleChange(e.target.value)}
                onClear={() => handleChange('')}
              />
              <UncontrolledDropdown className="moreOptionsCon">
                <DropdownToggle className="moreLeads">
                  <button className="sendBtn">
                    <CustomIcon icon="Header/Icon/More" />
                  </button>
                </DropdownToggle>
                <DropdownMenu>
                {id !== 'deactivate' ? 
                  <NavLink to="/admin/team/deactivate">
                    <DropdownItem>
                      <CustomIcon icon="Icon/Archive" />
                      View Deactivated
                    </DropdownItem>
                  </NavLink>
                : <NavLink to="/admin/team">
                    <DropdownItem>
                      <CustomIcon icon="Icon/Archive" />
                      View Activated
                    </DropdownItem>
                  </NavLink>}
                </DropdownMenu>
              </UncontrolledDropdown>
              {id !== 'deactivate' ? <>
                <button className="sendBtn teamHeadBtn" onClick={() => setIsLocked(!isLocked)}> 
                  {isLocked ? <CustomIcon icon= "Edit/Stroke" /> : <CustomIcon icon= "Icon/Lock" /> }
                </button>
                <button className="sendBtn teamHeadBtn" onClick={() => addNew()}>
                  <CustomIcon icon="Header/Icon/Add" />
                </button>
              </> : null}
            </div>
          </div>
          <Modal isOpen={modal} toggle={toggle} className="addLeadModal">
            <ModalBody>
              <div className="createLeadHeader">
                <h1>Confirmation</h1>
                <button type="button" className="roleCloseBtn" onClick={toggle}>
                  <span>
                    <i className="fas fa fa-times" />
                  </span>
                </button>
              </div>
              <div className="roleContent">
                <p>Once you deactivate, team member would not have an access to login.</p>
              </div>
              <div className="buttonOuter">
                <button type="button" className="cancelRoleBtn" onClick={toggle}>Cancel</button>
                <button type="button" className="sendRoleBtn" onClick={onDeactivate}>Deactivate</button>
              </div>
            </ModalBody>
          </Modal>
          <div className="tableBox">
            <InfiniteScroll
              pageStart={page}
              loadMore={loadFunc}
              hasMore={hasMore}
              loader={(
                <div className="tableLoading ShowTableLoader" key={0}>
                  <Loader
                    type="Oval"
                    color="#008080"
                    height={30}
                    width={30}
                  />
                </div>
              )}
              threshold={150}
              useWindow={false}
              initialLoad={false}
            >
              <TableContent
                columns={id === 'deactivate' ? deactivatedColumns : columns}
                 data={(id === 'deactivate' ? adminDeactivatedUsers : adminAllTeamDepartment) || []}
                tableActions={renderTableActions}
                loading={loading}
                onSave={onSave}
                onChange={onChange}
                removeRow={removeRow}
                selectMultipleRowHandler={selectMultipleRowHandler}
                selectedRows={selectedRows}
                options={{
                  countryCode: countries,
                  stateCode: states,
                  cityCode: cities,
                  phoneCode: phoneCode,
                  roleCode: roleList,
                  departmentCode: adminTeamDepartmentList
                }}
                noEditingEmail
                assignReportToHandler={assignReportToHandler}
                saveBtn={saveBtn}
                readOnly={isLocked}
                onRowClick={onRowClick}
              />
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </>
  );
}

Team.propTypes = {
  match: PropTypes.object,
  team: PropTypes.object,
  history: PropTypes.any
}
const mapStateToProps = (state) => ({
  adminTeamDepartmentList: state.adminTeam.adminTeamDepartmentList,
  adminAllTeamDepartment: state.adminTeam.adminAllTeamDepartment,
  roleList: state.permission.roleList,
  users: state.common.users,
  adminDeactivatedUsers: state.adminTeam.adminDeactivatedUsers,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Team);
