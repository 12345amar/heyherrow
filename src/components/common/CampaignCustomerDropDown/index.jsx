import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { propTypes } from 'react-bootstrap/esm/Image';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import CustomSwitch from '../CustomSwitch';
import DownShiftCheckbox from '../DownShiftWithCheckbox/DownShiftCheckbox';
import { css } from './Shared';
import './index.scss';
import FilterData from './FilterData';
import Filter from '../../../assets/Icons/Header/Icon/Filter.svg';
import Filtergrey from '../../../assets/Icons/Header/Icon/Filtergrey.svg';

const CampaignCustomerDropDown = ({
  data,
  onChange,
  disabled = false,
  value,
  placeholder,
  className,
  SearchFilterData,
  ResetFilters,
  ApplyFilterOpen
}) => {
  const [_value, setvalue] = useState(value);
  const [_isOpen, setOpen] = useState(true);
  const [toggledata, setToggledata] = React.useState({
    checkedA: true,
    uncheckedA: false,
  });
  const onMostRecentHandler = () => {
    SearchFilterData('', 1, '', '');
  };
  const handleChange = (event) => {
    if (event.target.checked) {
      SearchFilterData('', '', true, '');
    } else {
      SearchFilterData('', '', false, '');
    }
    if (event.target.checked) {
      return setToggledata({
        ...toggledata,
        [event.target.name]: event.target.checked
      });
    }
    return setToggledata({
      ...toggledata,
      [event.target.name]: event.target.unchecked
    });
  };
  const [isOpen, setIsOpen] = useState(true);

  function handleOver(e) {
    e.preventDefault();
    setIsOpen(!isOpen);
  }

  const getDisplayLabel = () => {
    const label = data?.find((dataItem) => dataItem.value === _value)?.label;
    return label || placeholder;
  };

  const onChangeHandler = (newValue) => {
    setvalue(newValue);
    if (onChange && typeof onChange === 'function') {
      onChange(newValue);
    }
  };
  const toggle = (e) => {
    setOpen(!e);
    ApplyFilterOpen(!e);
  };
  const onResetHandler = () => {
    ResetFilters();
  };
  const onSearchHandler = (keys) => {
    SearchFilterData(keys, '', '', '');
  };
  return (
    <>
      <UncontrolledDropdown isOpen={_isOpen} className={`custom-dropdown-campaign ${className}`}>
        <DropdownToggle disabled={disabled} onClick={() => toggle(_isOpen)}>
          {getDisplayLabel()}
        </DropdownToggle>
        <DropdownMenu style={{ border: 'none', boxShadow: 'none' }}>
          {data?.map((dataItem) => (
            <DropdownItem
              disabled={_value === dataItem.value}
              onClick={() => onChangeHandler(dataItem.value)}
              key={dataItem.value}
            >
              {dataItem.label}

            </DropdownItem>
          ))}
          <div className="mostrecent">
            <span className="most_recent_button" onClick={() => onMostRecentHandler()}>
              Most Recent
              <img className="most_recent_img" src={Filter} alt="mostrecent" />
            </span>
          </div>
          <div className="campaign_reach">
            <span className="campaign_reach_button" onClick={() => onMostRecentHandler()}>
              Reach
              <img className="campaign_reach_img" src={Filtergrey} alt="reach" />
            </span>
          </div>
          <div className="campaign__filters__type__left">
            <div
              {...css({
                display: 'flex',
                flexDirection: 'column',
                marginTop: 10
              })}
            >
              <DownShiftCheckbox itemToString={(item) => (item ? item.label : '')}>
                {() => (
                  <div className="custom-select-checkbox">
                    <span onClick={handleOver} className="custom-select-button-cam">
                      Type
                      {!isOpen
                        ? (
                          <KeyboardArrowDownIcon style={{ marginLeft: 234 }} />
                        )
                        : <KeyboardArrowUpIcon style={{ marginLeft: 234 }} />}
                    </span>
                    {!isOpen
                      ? null
                      : (
                        <div className={'item-list-filter-campaign ? "open" : ""} '}>
                          <FilterData onSearchHandler={onSearchHandler} />

                        </div>
                      )}

                  </div>
                )}
              </DownShiftCheckbox>
            </div>
          </div>
          <div className="showdrafts_campaign">
            <span className="showdrafts-button">
              Show Drafts
              <span style={{ float: 'right' }}>
                <CustomSwitch onChange={handleChange} />
              </span>
            </span>

          </div>
          <div className="resetCampaign">
            <span className="resetbtnCampaign" onClick={onResetHandler}>Reset</span>
          </div>

        </DropdownMenu>

      </UncontrolledDropdown>
    </>

  );
};

CampaignCustomerDropDown.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  placeholder: PropTypes.string,
  className: PropTypes.string,
  SearchFilterData: PropTypes.func,
  ResetFilters: PropTypes.func,
  ApplyFilterOpen: propTypes.func
};

CampaignCustomerDropDown.defaultProps = {
  onChange: () => { },
  disabled: false,
  value: '',
  placeholder: '',
  className: '',
  SearchFilterData: () => { },
  ResetFilters: () => { },
  ApplyFilterOpen: () => { }
};

export default CampaignCustomerDropDown;
