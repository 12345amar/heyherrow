/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import SideDrawer from '../../../components/cards/SideDrawer';
import CustomIcon from '../../../components/common/CustomIcon';
import TableContent from '../../../components/common/ContentsTable';
import { nFormatter } from '../../../utils/formatMessageDate';
import { getCustomerOverview, getCustomersDealMode, getCustomersProductDetails, getCustomerNotes } from '../../../api/adminCustomers';
import './index.scss';
import SideTabsComponent from '../../../components/common/SideTabsComponent';
import HeaderDropDown from '../../../components/common/HeaderDropDown';
import ProfileInitial from '../../../components/common/ProfileInitials';
import DealModeDrawer from '../DealModeDrawer';
import Notes from '../../../components/Notes';
import { DEAL_MODE_STATUSES } from '../../../constants';


const columns = [
  { label: 'Date', key: 'created_at', type: "date" },
  { label: 'Machine', key: 'machine' },
  { label: 'Category', key: 'category' },
  { label: 'Type', key: 'type', type: 'type' },
  { label: 'Price', key: 'amount', type: 'price' },
  { label: 'Team Members', key: 'teamMember', type: 'team_member' }
];

const columnsQuoted = [
  { label: 'Date', key: 'created_at', type: "date" },
  { label: 'Machine', key: 'machine' },
  { label: 'Category', key: 'category' },
  { label: 'Type', key: 'type', type: 'type' },
  { label: 'Price', key: 'quoteValue', type: 'price' },
  { label: 'Team Members', key: 'teamMember', type: 'team_member' }
];

const columnsShared = [
  { label: 'Date', key: 'created_at', type: "date" },
  { label: 'Machine', key: 'machine' },
  { label: 'Category', key: 'category' },
  { label: 'Type', key: 'type', type: 'type' },
  { label: 'Price', key: 'price', type: 'price' },
  { label: 'Margin', key: 'price', type: 'price' },
  { label: 'Via', key: 'via' },
  { label: 'Team Members', key: 'teamMember', type: 'team_member' }
];

const columnsDeal = [
  { label: 'Created on', key: 'created_at', type: "date" },
  { label: 'Deal Name', key: 'machine' },
  { label: 'New Assets', key: 'newAssets' },
  { label: 'New Assets Value', key: 'newAssetsValue', type: 'price' },
  { label: 'Trade In', key: 'tradeIn' },
  { label: 'Trade Value', key: 'tradeInValue', type: 'price' },
  { label: 'Net Margin', key: 'netMargin', type: 'price' },
  { label: 'Net Margin %', key: 'netMarginPercentage' },
  { label: 'Status', key: 'status' },
  { label: 'Assign to', key: 'teamMember', type: 'team_member' }
];

const bottomTabs = ['Shared', 'Quoted', 'Sold', 'Closed', 'Deal Mode', 'Notes'];
const durationTabs = ['Month', 'Quarter', 'Year'];
const selectType = ['All Type', 'New', 'Used'];
const currentYear = new Date().getFullYear();


function CustomerDetail(props) {
  const {
    match: {
      params: { id },
    },
  } = props;

  const [activeTab, setActiveTab] = useState(2);
  let customerId = useParams()?.customerId;
  const [activeStateTab, setActiveStateTab] = useState(0);
  const [loading, setloading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [customerDetailList, setCustomerDetailList] = useState([]);
  const [customerDealsList, setCustomerDealsList] = useState([]);
  const [openDealModeDrawer, setOpenDealModeDrawer] = useState(false);
  const [dealToShow, setDealToShow] = useState();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: 'shared',
    duration: 'all',
    durationType: 'yearly',
    search: '',
    id: customerId,
  });

  const { dispatch, adminCustomerDetail, adminCustomerSide, adminCustomerList } = props;

  useEffect(() => {
    getCustomerData(filters);
    getCustomerOverview(customerId);
  }, [filters]);

  useEffect(() => {
    dispatch(getCustomerNotes({
      customerId
    }));
  }, [customerId]);

  useEffect(() => {
    dispatch(getCustomerOverview(customerId));
  }, []);

  useEffect(() => {
    setCustomerDetailList(customerDetails);
    setCustomerDealsList(customerDeals);
  }, [adminCustomerDetail])

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

  const onStateChangeTab = (currentTab = 0) => {
    setActiveStateTab(currentTab);
    let status = 'shared';
    switch (currentTab) {
      case 0:
        status = 'shared';
        break;
      case 1:
        status = 'quoted';
        break;
      case 2:
        status = 'sold';
        break;
      case 3:
        status = 'closed';
        break;
      case 4:
        status = 'deal';
        break;

      case 5:
        status = 'notes';
        break;
      default:
        break;
    }
    filterHandler({ status: status });
  };
  const onChangeDuration = (e) => {
    const { value } = e.target;
    filterHandler({ duration: value });
  };

  const searchHandler = (e) => {
    filterHandler({ page: 1 });
    filterHandler({ search: e.target.value });
  };

  const filterHandler = (items) => {
    const _filter = { ...filters, page: 1, ...items };
    setFilters(_filter);
  };

  const getCustomerData = (_filters) => {
    setloading(true);
    if (_filters.status === 'deal') {
      dispatch(getCustomersDealMode(_filters.id, _filters.durationType, _filters.duration, _filters.page, _filters.search));
    } else if (_filters.status !== 'notes') {
      dispatch(getCustomersProductDetails(_filters.id, _filters.status, _filters.durationType, _filters.duration, _filters.page, _filters.search));
    }
    setloading(false);
  };

  const loadFunc = () => {
    if (!loading) {
      getCustomerData(filters);
    }
  };

  const renderTableActions = (item) => (
    <div className="table-actions">
      <button
        className="sendBtn"
        onClick={() => {
          setOpenDealModeDrawer(true);
          setDealToShow(item);
        }}
      >
        <i className="fas fa-chevron-right" />
      </button>
    </div>
  );

  if (loading) {
    return null
  }

  const productHashMap = adminCustomerDetail && adminCustomerDetail.products || {}
  const dealsHashMap = adminCustomerDetail && adminCustomerDetail.deals || {}

  const customerDetails = Object.keys((productHashMap)).reduce(
    (result, dateKey) => {
      return result.concat(productHashMap[dateKey])
    }, []
  ).map(
    product => ({
      amount: product.amount,
      created_at: product.createdAt,
      id: product.id,
      category: product.product.category,
      description: product.product.description,
      ProductId: product.product.id,
      machine: product.product.machine,
      manufacturer: product.product.manufacturer,
      model: product.product.model,
      modelName: product.product.modelName,
      modelYear: product.product.modelYear,
      price: product.product.price,
      productAssets: product.product.productAssets,
      serialNumber: product.product.serialNumber,
      stockNumber: product.product.stockNumber,
      type: product.type,
      via: product.type === 1 ? 'Text' : product.type === 2 ? 'Email' : '-',
      teamMember: product.salesRep ? `${product.salesRep.firstName} ${product.salesRep.lastName}` : ''
    })
  )

  const customerDeals = Object.keys((dealsHashMap)).reduce(
    (result, dateKey) => {
      return result.concat(dealsHashMap[dateKey])
    }, []
  ).map(
    deal => ({
      ...deal,
      id: deal.id,
      machine: deal.dealName,
      created_at: deal.createdAt,
      newAssets: deal.purchaseProducts.length,
      newAssetsValue: deal.purchaseProducts.reduce((t, c) => t + c?.product?.price, 0),
      tradeIn: deal.tradeProducts.length,
      tradeInValue: deal.tradeProducts.reduce((t, c) => t + c?.productSold?.amount, 0),
      netMargin: deal.currentMargin || 0,
      netMarginPercentage: deal.tradeMargin || '-',
      status: {
        value: DEAL_MODE_STATUSES.find(
          (status) => status.value === deal?.state
        )?.label,
        cellClass: deal?.state === 'in_progress' ? 'in_progress' : ''
      },
      teamMember: deal?.salesRep ? `${deal?.salesRep?.firstName} ${deal?.salesRep?.lastName}` : ''
    })
  )

  const handleTypeChange = (e) => {
    const { value } = e.target;
    if (value === 'New') {
      setCustomerDetailList(customerDetails.filter((data) => data.modelYear >= currentYear));
    }
    else if (value === 'Used') {
      setCustomerDetailList(customerDetails.filter((data) => data.modelYear < currentYear));
    }
    else {
      setCustomerDetailList(customerDetails);
    }
  }

  return (
    <>
      <div className="contentContainerFull teamDescription customerDetails">
        <div className="innerFullCon leftSideBar">
          <div className="product-head-title customer-title-head">
            <Link to="/admin/customers"><i class="fa fa-angle-left" aria-hidden="true"></i></Link><h4>Customers</h4>
          </div>
          <div className="tableBox">
            <ul className="listCon timeLineContainer">
              <li className="listItem active">
                <div className="infoBox">
                  <div className="userCard">
                    <div style={{ position: 'relative', zIndex: 9 }}>
                      <ProfileInitial firstName={get(adminCustomerSide.customer, 'firstName', '')} lastName={get(adminCustomerSide.customer, 'lastName', '')} size="medium" profileId={get(adminCustomerSide.customer, 'id', '')} />
                    </div>
                    {adminCustomerSide && adminCustomerSide.customer && adminCustomerSide.customer.salesRep ?
                      <div style={{ position: 'absolute', top: 0, left: 20 }}>
                        <ProfileInitial firstName={get(adminCustomerSide.customer.salesRep, 'firstName', '')} lastName={get(adminCustomerSide.customer.salesRep, 'lastName', '')} size="medium" profileId={get(adminCustomerSide.customer.salesRep, 'id', '')} />
                      </div>
                      : null}
                  </div>
                  <div className="userName">
                    <h4>
                      {`${get(adminCustomerSide.customer, 'firstName', '')} ${get(
                        adminCustomerSide.customer,
                        'lastName',
                        ''
                      )}`}
                    </h4>
                    <p>{`${get(adminCustomerSide.customer, 'city.name', '')} ${get(
                      adminCustomerSide.customer,
                      'city.state.name',
                      ''
                    )}`}</p>
                    <ul className="userActions">
                      <li>
                        <a href={`mailto:${get(adminCustomerSide.customer, 'email', '')}`}>
                          <CustomIcon icon="Icon/Email" />
                        </a>
                      </li>
                      <li>
                        <Link to={`/admin/chats/customers/${adminCustomerSide.customer && adminCustomerSide.customer.id}`}>
                          <CustomIcon icon="Icon/Chat Regular" />
                        </Link>
                      </li>
                    </ul>
                  </div>
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
                  totalCount={adminCustomerSide && adminCustomerSide}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="innerFullCon rightSection">
          {activeStateTab !== 5 &&
            <div className="cardHeader noborder">
              <div className="topActionBar" style={{ right: 5 }}>
                {activeStateTab !== 4 ?
                  <div className="bottomTabs">
                    <div className="selecBox" style={{ margin: 0 }}>
                      <select className="form-control" onChange={handleTypeChange}>
                        {selectType.map((item) => (
                          <option style={{ fontSize: '15px' }}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                    <HeaderDropDown
                      activeTab={activeTab}
                      tabs={durationTabs}
                      renderSelect
                      renderSelectOnRight
                      onChangeTab={onChangeTab}
                      onChangeDuration={onChangeDuration}
                    />
                  </div>
                  : null}

                <div style={{ marginLeft: 10 }}>
                  <SideDrawer logs={adminCustomerDetail.logs} />
                </div>
              </div>
            </div>
          }

          {activeStateTab !== 5 ?
            <div
              className="detailCards overviewCards"
              style={{ marginTop: 20, marginBottom: 20 }}
            >
              <div className="cardBox">
                <div className="innerCardCon gray">
                  <h4>REVENUE</h4>
                  <h3>
                    {(adminCustomerDetail.salesData && `$${nFormatter(adminCustomerDetail.salesData.volume)}`) || '$0'}
                  </h3>
                </div>
              </div>
              <div className="cardBox">
                <div className="innerCardCon gray">
                  <h4>AVG. TURN</h4>
                  <h3>
                    {(adminCustomerDetail.salesData && `${nFormatter(adminCustomerDetail.salesData.avgTurn == '-' ? 0 : adminCustomerDetail.salesData.avgTurn)}D`) || '0D'}
                  </h3>
                </div>
              </div>
              <div className="cardBox">
                <div className="innerCardCon gray">
                  <h4>UNITS</h4>
                  <h3>
                    {(adminCustomerDetail.salesData && `${nFormatter(adminCustomerDetail.salesData.units)}`) || '0'}
                  </h3>
                </div>
              </div>
              <div className="cardBox">
                <div className="innerCardCon gray">
                  <h4>EST. MARGIN</h4>
                  <h3>
                    {(adminCustomerDetail.salesData && `$${nFormatter(adminCustomerDetail.salesData.estMargin == '-' ? 0 : adminCustomerDetail.salesData.estMargin)}`) || '$0'}
                  </h3>
                </div>
              </div>
            </div>
            : null}
          <div className="tableBox">
            <InfiniteScroll
              pageStart={page}
              loadMore={loadFunc}
              hasMore={hasMore}
              threshold={150}
              useWindow={false}
              initialLoad={false}
            >
              {activeStateTab !== 5 ?
                <TableContent
                  columns={activeStateTab === 0 ? columnsShared : (activeStateTab === 4 ? columnsDeal : (activeStateTab === 1 ? columnsQuoted : columns))}
                  loading={loading}
                  data={(activeStateTab === 4 ? customerDealsList : customerDetailList) || []}
                  readOnly
                  tableActions={renderTableActions}
                  noActions={activeStateTab !== 4}
                  emptyMessage={bottomTabs[activeStateTab]}
                />
                :
                <Notes fromCustomersDetails={true} />
              }
            </InfiniteScroll>
          </div>
        </div>
        <DealModeDrawer
          isOpen={openDealModeDrawer}
          onClose={() => setOpenDealModeDrawer(false)}
          dealId={dealToShow?.id}
        />
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  adminCustomerDetail: state.adminCustomer.adminCustomerDetail,
  adminCustomerSide: state.adminCustomer.adminCustomerSide,
});

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetail);
