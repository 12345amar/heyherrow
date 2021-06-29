import React from 'react';
import { Divider } from '@material-ui/core';
import { useSelector } from 'react-redux';
import moment from 'moment';

import './index.scss';
import Loader from '../common/Loader';
import moneyFormatter from '../../utils/moneyFormatter';

const Interest = () => {
  const { interests } = useSelector((state) => state.customers);
  if (interests.loading) {
    return (
      <div className="customer-interest-container">
        <div className="customer-interest__header">
          <h3>Interest</h3>
          <Divider />
          <Loader secondary />
        </div>
      </div>
    );
  }
  return (
    <div className="customer-interest-container">
      <div className="customer-interest__header">
        <h3>Interest</h3>
        <Divider />
      </div>
      {!interests.data.length && <center>No interest found!</center>}
      {interests.data.map((interest) => {
        const prices = interest.priceRange.split('-');
        return (
          <div className="customer-interest-body">
            <div className="customer-interest__item">
              <h4>Product categories</h4>
              {interest.categories.split(',')
                .map((category) => <span className="tag">{category}</span>)}
            </div>
            <div className="customer-interest__item">
              <h4>Price range</h4>
              <span className="tag">{`${moneyFormatter.format(prices[0])} - ${moneyFormatter.format(prices[1])}`}</span>
            </div>
            <div className="customer-interest__item">
              <h4>Product type</h4>
              <span className="tag">{interest.productType}</span>
            </div>
            <div className="customer-interest__item">
              <h4>Notes</h4>
              <span className="tag">{interest.notes}</span>
            </div>
            <span className="time">{`Submitted ${moment(interest.createdAt).format('ll')}`}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Interest;
