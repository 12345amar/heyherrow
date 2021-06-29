import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import './index.scss';
import Archive from '../../../assets/Icons/Header/Icon/Archive.svg';
// import ArchiveIcon from '../../../assets/Icons/Header/Icon/ArchiveIcon.svg';

const CampaignFolderDropDown = ({
  data,
  onChange,
  disabled = false,
  value,
  placeholder,
  className,
  SearchFilterData
}) => {
  const [_value, setvalue] = useState(value);
  const getDisplayLabel = () => placeholder;

  const onChangeHandler = (newValue) => {
    SearchFilterData('', '', '', newValue);
    setvalue(newValue);
    if (onChange && typeof onChange === 'function') {
      onChange(newValue);
    }
  };
  return (
    <UncontrolledDropdown className={`custom-dropdown-pinned ${className}`}>
      <DropdownToggle disabled={disabled}>
        {getDisplayLabel()}
      </DropdownToggle>
      <DropdownMenu style={{ height: '150px', maxHeight: '200px', overflowY: 'scroll' }}>
        {data.length > 0
          ? data.map((dataItem) => (
            <DropdownItem
              disabled={_value === dataItem.id}
              onClick={() => onChangeHandler(dataItem.id)}
              key={dataItem.id}
            >
              <div className="successful-folder">
                <span className={_value === dataItem.id ? 'successful-folder_button successful-folder_button-active' : 'successful-folder_button'}>
                  <img className="successful-folder_img" src={Archive} alt="archive" />
                  {dataItem.name}
                </span>
              </div>
            </DropdownItem>
          ))
          : (
            <>
            </>
          )}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

CampaignFolderDropDown.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func,
  SearchFilterData: PropTypes.func,
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

CampaignFolderDropDown.defaultProps = {
  onChange: () => { },
  SearchFilterData: () => { },
  disabled: false,
  value: '',
  placeholder: '',
  className: ''
};

export default CampaignFolderDropDown;
