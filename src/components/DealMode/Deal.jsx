import React, { useState } from 'react';
import { Divider, SwipeableDrawer, IconButton } from '@material-ui/core';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { useDispatch } from 'react-redux';

import getProductName from '../../utils/getProductName';
import { formattedProductPrice } from '../../utils/getProductPrice';
import getProductImgUrl from '../../utils/getProductImageUrl';
import CustomIcon from '../common/CustomIcon';
import CustomSwitch from '../common/CustomSwitch';
import {
  uploadDocForDealElement,
  updateDeal
} from '../../api';
import NewAsset from './NewAsset';
import TradeIn from './TradeIn';
import moneyFormatter from '../../utils/moneyFormatter';
import { updateDealSuccess } from '../../redux/actions';

const Deal = ({ deal }) => {
  const [isDrawer, setDrawer] = useState(false);
  const dispatch = useDispatch();
  const toggleDrawer = () => {
    setDrawer(!isDrawer);
  };
  const [dealForm, setDealForm] = useState({
    dealName: deal.dealName,
    purchaseProducts: deal.purchaseProducts || [],
    tradeProducts: deal.tradeProducts || []
  });
  const [isSaving, setIsSaving] = useState(false);

  const documentUploadHandler = (id, body) => {
    dispatch(uploadDocForDealElement(id, body));
  };

  const onUpload = (e, id) => {
    const body = new FormData();
    body.append('document', e.target.files[0]);
    documentUploadHandler(id, body);
  };

  const changeDealStatusHandler = (state) => {
    setIsSaving(true);
    dispatch(updateDeal(deal.id, {
      state
    })).finally(() => {
      setIsSaving(false);
      dispatch(updateDealSuccess({
        ...deal,
        state,
      }));
    });
  };

  const updateTradeIn = (newTradeIn) => {
    const newDealForm = {
      ...dealForm,
      tradeProducts: [
        {
          ...dealForm.tradeProducts[0],
          ...newTradeIn
        }
      ]
    };
    setDealForm(newDealForm);
    setIsSaving(true);
    dispatch(updateDeal(deal.id, {
      tradeProducts: [{
        ...newTradeIn,
        id: dealForm.tradeProducts[0].id
      }],
    })).finally(() => {
      setIsSaving(false);
    });
    dispatch(updateDealSuccess({
      ...deal,
      ...newDealForm
    }));
  };

  const updatePurchaseProducts = (value) => {
    const newDealForm = {
      ...dealForm,
      purchaseProducts: [
        {
          ...dealForm.purchaseProducts[0],
          productQuoted: {
            ...dealForm.purchaseProducts[0].productQuoted,
            ...value
          }
        }
      ]
    };
    setDealForm(newDealForm);
    setIsSaving(true);
    dispatch(updateDeal(deal.id, {
      purchaseProducts: [{
        id: dealForm.purchaseProducts[0].id,
        ...value
      }]
    })).finally(() => {
      setIsSaving(false);
    });
    dispatch(updateDealSuccess({
      ...deal,
      newDealForm
    }));
  };

  return (
    <>
      <div className="deal-category">
        <div
          className="flex justify-between items-start cursor-pointer"
          onClick={toggleDrawer}
        >
          <div>
            <h3 className="deal-category__title">{deal.dealName}</h3>
            <span className="deal-category__subtitle">
              {`Created on ${moment(deal.createdAt).format('MM/DD/YYYY')}`}
            </span>
          </div>
          {deal.state === 'in_progress' && (
            <span className="deal-mode-inprogress">In progress</span>
          )}
          {deal.state !== 'in_progress' && (
            <span className="tag">{deal.state}</span>
          )}
        </div>
        <Divider />
        {deal.purchaseProducts.map(({ deliveryOn, product, ...res }) => (
          <div className="deal-list-item">
            <div className="deal-img">
              <img src={getProductImgUrl(product || res, '/Icons/product-img-small.svg')} alt="deal-img" />
              <span>New Asset</span>
            </div>
            <div className="flex-1 cursor-pointer">
              <h3 className="deal-mode__name">
                <span>{getProductName(product || res)}</span>
                <span>{formattedProductPrice(product || res)}</span>
              </h3>
              {deal.state === 'in_progress'
              && (
                <span className="deal-mode-due">
                  {`Delivery due ${moment(deliveryOn).fromNow()}`}
                </span>
              ) }
            </div>
          </div>
        ))}
        {deal?.tradeProducts?.map(({ productSold, ...res }) => (
          <div className="deal-list-item">
            <div className="deal-img">
              <img src={getProductImgUrl(productSold?.product || res, '/Icons/product-img-small.svg')} alt="deal-img" />
              <span>Trade In</span>
            </div>
            <div className="flex-1">
              <h3 className="deal-mode__name">
                <span>{getProductName(productSold?.product || res)}</span>
                <span>{moneyFormatter.format(productSold?.amount || res)}</span>
              </h3>
            </div>
          </div>
        ))}
      </div>
      <SwipeableDrawer
        anchor="right"
        BackdropProps={{ invisible: true }}
        open={isDrawer}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
      >
        <div className="quote-details-drawer deal-mode-container">
          <div className="flex items-center">
            <div className="flex flex-1 justify-between items-start cursor-pointer deal-category">
              <div>
                <h3 className="deal-category__title">{deal?.dealName}</h3>
                <span className="deal-category__subtitle">
                  {`Created on ${moment(deal.createdAt).format('MM/DD/YYYY')}`}
                </span>
              </div>
              {deal.state === 'in_progress' && (
                <span className="deal-mode-inprogress">{!isSaving ? 'In progress' : 'Updating...'}</span>
              )}
              {deal.state !== 'in_progress' && (
                <span className="tag">{deal.state}</span>
              )}
            </div>
            {deal.state === 'in_progress'
            && (
              <UncontrolledDropdown className="moreOptionsCon">
                <DropdownToggle>
                  <IconButton size="small">
                    <CustomIcon icon="more-vertical" />
                  </IconButton>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Edit</DropdownItem>
                  <DropdownItem onClick={() => changeDealStatusHandler('canceled')}>
                    Cancel Deal
                  </DropdownItem>
                  <DropdownItem onClick={() => changeDealStatusHandler('closed')}>
                    Close Deal
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            )}
            <IconButton size="small" onClick={toggleDrawer}>
              <CustomIcon icon="Close" />
            </IconButton>
          </div>
          <Divider />
          <div className="products-list">
            {dealForm.purchaseProducts.map(({
              product,
              deliveryOn,
              productQuoted,
              ...res
            }, index) => (
              <NewAsset
                deliveryOn={deliveryOn}
                product={product || res}
                showDivider={index + 1 !== deal.purchaseProducts.length}
                productQuoted={productQuoted}
                onChange={(value) => updatePurchaseProducts(value)}
                showDelivery={deal.state === 'in_progress'}
              />
            ))}
            <>
              <div className="flex items-center justify-between">
                <h3 className="h3-heading mt-2">Trade in</h3>
                <CustomSwitch checked />
              </div>
              <Divider />
              {dealForm.tradeProducts.map(({ productSold, allowance }) => (
                <TradeIn
                  productSold={productSold}
                  allowance={allowance}
                  onChange={(value) => updateTradeIn(value)}
                />
              ))}
              <div className="details-group">
                {dealForm.purchaseProducts.map(({ product, productQuoted }) => (
                  <div className="quote-detail-item">
                    <span>{getProductName(product)}</span>
                    <span>
                      {moneyFormatter
                        .format(Number(productQuoted?.shipping || 0)
                        + Number(productQuoted?.amount || 0)
                        + Number(productQuoted?.taxes || 0)
                        + Number(productQuoted?.otherFees || 0)
                        - Number(productQuoted?.discount || 0))}
                    </span>
                  </div>
                ))}
                {dealForm.tradeProducts.map(({ productSold, allowance }) => (
                  <div className="quote-detail-item">
                    <span>{getProductName(productSold?.product)}</span>
                    <span>
                      -
                      {moneyFormatter
                        .format(Number(allowance || 0)
                        + Number((productSold?.amount || 0)))}
                    </span>
                  </div>
                ))}
                <div className="quote-detail-item total">
                  <span>Net Price (8.0%)</span>
                  <span>
                    {
                      moneyFormatter
                        .format(
                          (
                            (dealForm.purchaseProducts[0]
                              ?.productQuoted?.amount || 0)
                        + (dealForm.purchaseProducts[0]
                          ?.productQuoted?.shipping || 0)
                        + (dealForm.purchaseProducts[0]
                          ?.productQuoted?.taxes || 0)
                        - (dealForm.purchaseProducts[0]
                          ?.productQuoted?.discount || 0)
                        + (dealForm.purchaseProducts[0]
                          ?.productQuoted?.otherFees || 0)
                          )
                        - (dealForm.tradeProducts[0]?.allowance || 0)
                        + (dealForm.tradeProducts[0]
                          ?.productSold?.amount || 0)
                        )
                    }
                  </span>
                </div>
              </div>
            </>
            <h3 className="h3-heading mt-2">Payment Method</h3>
            <Divider />
            <div className="deal-mode-payment-list">
              {deal.paymentMethods.map((method) => (
                <span className="tag">{method.name}</span>
              ))}
            </div>
            <h3 className="h3-heading mt-3">Deal elements</h3>
            <Divider />
            <div className="deal-element-list">
              {deal.dmElements.map(({
                dealElement,
                id,
                dmElementsDocs = [],
                ...res
              }) => (
                <div className="deal-element-item">
                  {!dmElementsDocs.length
                    ? <div className="radio" />
                    : (
                      <div>
                        <CustomIcon icon="check" className="mr-1" />
                      </div>
                    )}
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="h3-heading">{dealElement?.name || res.name}</h3>
                      {dealElement?.name === 'Purchase Order' || dealElement?.name === 'Quote' ? <button type="button">Create</button>
                        : (
                          <>
                            <input
                              type="file"
                              id={`deal-element-${id}`}
                              hidden
                              onChange={(e) => onUpload(e, id)}
                              accept="application/pdf"
                            />
                            <label
                              htmlFor={`deal-element-${id}`}
                              type="submit"
                            >
                              Upload
                            </label>
                          </>
                        )}
                    </div>
                    <Divider />
                    <div className="deal-element-doc-list">
                      {dmElementsDocs.map((doc) => (
                        <div className="flex justify-between mb-2">
                          <div className="flex">
                            <div
                              className="flex document-file-icon"
                            >
                              <CustomIcon icon="pdf" />
                            </div>
                            <div className="flex column document-preview-details">
                              <span>{doc.fileNAme || doc.gcsFilename}</span>
                              <span className="time">{`Sent on ${moment(doc.createdAt).format('MM/DD/YYYY')}`}</span>
                            </div>
                          </div>
                          <button type="button">Preview</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SwipeableDrawer>
    </>
  );
};

Deal.propTypes = {
  deal: PropTypes.objectOf(PropTypes.any),
};

Deal.defaultProps = {
  deal: {},
};

export default Deal;
