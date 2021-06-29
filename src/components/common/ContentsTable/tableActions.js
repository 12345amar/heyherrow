/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import CustomIcon from '../CustomIcon';

export const RenderActions = ({
  item,
  index,
  saveBtn,
  removeRow,
  tableActions,
}) => (
  <>
    {item.isNewItem
      ? (
        <div className="table-actions alwaysShow">
          {saveBtn && saveBtn(item, index)}
          <button className="sendBtn" onClick={() => removeRow(index)}>
            <i className="fa fa-times" />
          </button>
        </div>
      )
      : typeof tableActions === 'function' ? (tableActions(item))
        : (
          <div className="table-actions">
            <button className="sendBtn">
              <CustomIcon icon="Header/Icon/More" />
            </button>
          </div>
        )}
  </>
);

RenderActions.propTypes = {
  item: PropTypes.object,
  index: PropTypes.number,
  saveBtn: PropTypes.func,
  removeRow: PropTypes.func,
  onSave: PropTypes.func,
  tableActions: PropTypes.any
};
