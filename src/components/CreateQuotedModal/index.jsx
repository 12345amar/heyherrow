import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalBody,
} from 'reactstrap';
import PropTypes from 'prop-types';
import {
  Radio,
  IconButton,
  Divider
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { debounce } from 'lodash';
import { useParams } from 'react-router-dom';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { toast } from 'react-toastify';

import './index.scss';
import CustomIcon from '../common/CustomIcon';
import SearchInput from '../common/SearchInput';
import Button from '../common/Button';
import { getAllProducts, getQuotePreview, markProductAsQuoted } from '../../api';

import Loader from '../common/Loader';
import { clearAllProducts } from '../../redux/actions';
import getProductPrice, { formattedProductPrice } from '../../utils/getProductPrice';
import QuotePreviewModal from '../../containers/QuotePreview/Modal';
import getProductImgUrl from '../../utils/getProductImageUrl';
import getProductName from '../../utils/getProductName';
import TabPanel from '../common/TabPanel';
import Input from '../common/Input';
import moneyFormatter from '../../utils/moneyFormatter';
import calcPercentage from '../../utils/calCulatePercentage';
import QuoteTemplate from '../QuoteTemplate';
import ConfirmationModal from './ConfrimationModal';

const CreateQuotedModal = ({
  isOpen,
  toggle,
  ...props
}) => {
  const { allProducts } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    page: 1,
  });
  const [shippingPrice] = useState('');
  const [isQuotePreviewModal, setIsQuotePreviewModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [steps, setSteps] = useState([
    {
      value: 'product',
      label: 'Product',
      completed: false,
    },
    {
      value: 'markup',
      label: 'Markup',
      completed: false,
    },
    {
      value: 'message',
      label: 'Message',
      completed: false,
    }
  ]);
  const [activeMenu, setActiveMenu] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [shipping, setShipping] = useState(0);
  const [quotedPrice, setQuotedPrice] = useState(0);
  const { client } = useSelector((state) => state);
  const { customerId } = useParams();
  const { quotePreview } = useSelector((state) => state.customers);
  const [discount, setDiscounts] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [fees, setFees] = useState(0);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isConfirmModal, setConfirmModal] = useState(false);

  const toggleConfirmModal = () => {
    setConfirmModal(!isConfirmModal);
  };

  const onChange = (index) => {
    setActiveMenu(index);
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(getAllProducts(filters));
    }
  }, [filters, isOpen]);

  useEffect(() => {
    setQuotedPrice(getProductPrice(selectedProduct));
  }, [selectedProduct]);

  const loadMoreProducts = () => {
    setFilters({
      ...filters,
      page: filters.page + 1
    });
  };

  const onSearch = debounce((text) => {
    dispatch(clearAllProducts());
    setFilters({
      search: text,
      page: 1
    });
  }, 500);

  const toggleisQuotePreviewModal = () => {
    setIsQuotePreviewModal(!isQuotePreviewModal);
  };

  const next = () => {
    const newStep = { ...steps[activeMenu], completed: true };
    setSteps([...steps.slice(0, activeMenu),
      newStep,
      ...steps.slice(activeMenu + 1)]);
    setActiveMenu(activeMenu + 1);
  };

  const onPreview = () => {
    const body = {
      amount: quotedPrice,
      shipping,
      productId: selectedProduct.id,
      customerId
    };
    dispatch(getQuotePreview(body));
    next();
  };

  const previous = () => {
    setActiveMenu(activeMenu - 1);
  };

  const reformatMoney = (money) => money.replaceAll(/[^0-9.]/g, '');
  const formatMoney = (money) => {
    if (money === '') {
      return money;
    }
    return moneyFormatter.format(money);
  };

  const reset = () => {
    toggle();
    setSelectedProduct({});
    setSubject('');
    setMessage('');
    setTaxes(0);
    setFees(0);
    setShipping(0);
    setDiscounts(0);
    setActiveMenu(0);
    setSteps([
      {
        value: 'product',
        label: 'Product',
        completed: false,
      },
      {
        value: 'markup',
        label: 'Markup',
        completed: false,
      },
      {
        value: 'message',
        label: 'Message',
        completed: false,
      }
    ]);
  };

  const onSend = () => {
    const body = {
      amount: quotedPrice,
      shipping,
      productId: selectedProduct.id,
      customerId,
      via: 2,
      discount,
      otherFees: fees,
      taxes,
      message: {
        subject,
        body: message
      }
    };
    setSending(true);
    dispatch(markProductAsQuoted(body)).then(() => {
      toast.success('Quote sent successfully');
    }).catch(() => {
      toast.error('Quote failed!');
    }).finally(() => {
      toggle();
      setSending(false);
      reset();
    });
  };

  const closeQuote = () => {
    toggle();
    toggleConfirmModal();
    reset();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggleConfirmModal}
        centered
        className="deal-mode__modal"
      >
        <div className="modal-header">
          <h5 className="modal-title">Create quote</h5>
          <IconButton
            className="cancel modal-close"
            onClick={toggleConfirmModal}
            size="small"
          >
            <CustomIcon icon="Close" />
          </IconButton>
        </div>
        <ModalBody>
          <div className="flex h-full">
            <div className="deal-mode__left-section">
              <FormControl component="fieldset">
                <RadioGroup aria-label="menus" name="menu">
                  {steps.map((step, index) => (
                    <FormControlLabel
                      className={step.selected ? 'selected' : ''}
                      value={step.value}
                      control={(
                        <>
                          {step.completed
                          && (
                            <CustomIcon
                              className="radio-option-done"
                              icon="check"
                              key={step.value}
                            />
                          )}
                          <Radio
                            checked={activeMenu === index}
                            size="small"
                            onChange={() => onChange(index)}
                            hidden={step.completed}
                            disabled={index !== 0
                              && !steps[index - 1]?.completed}
                          />
                        </>
                      )}
                      label={step.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
            <Divider orientation="vertical" />
            <div className="deal-mode__right-section">
              <TabPanel index={0} value={activeMenu}>
                <div className="action-product-modal__inputs">
                  <SearchInput
                    onChange={(e) => onSearch(e.target.value)}
                    onClear={() => onSearch('')}
                    placeholder="Search and add product"
                  />
                </div>
                <div className="products-list">
                  <InfiniteScroll
                    dataLength={allProducts.data.length}
                    hasMore={allProducts.hasMore}
                    next={loadMoreProducts}
                    loader={<Loader secondary key={0} />}
                    height="380px"
                    endMessage={(
                      <p style={{ textAlign: 'center' }}>
                        <b>No more data</b>
                      </p>
                    )}
                  >
                    {allProducts.data.map((product) => (
                      <div key={product.id} className="flex items-center w-100 deal-mode-product-list-item-container">
                        <div className="products-list__item flex-1">
                          <div className="product-list-img">
                            <img alt="" src={getProductImgUrl(product)} />
                          </div>
                          <div className="flex-1">
                            <h3 className="flex justify-between">
                              <span>{getProductName(product)}</span>
                              <span>{formattedProductPrice(product)}</span>
                            </h3>
                            <div>
                              <span className="tag">{product?.category}</span>
                            </div>
                          </div>
                          {product.id === selectedProduct.id ? (
                            <CustomIcon
                              className="self-end"
                              icon="Tick"
                            />
                          ) : (
                            <CustomIcon
                              className="self-end"
                              icon="Add"
                              onClick={() => setSelectedProduct(product)}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </InfiniteScroll>
                </div>
              </TabPanel>
              <TabPanel index={1} value={activeMenu}>
                <div className="products-list" style={{ height: '430px' }}>
                  <div className="flex items-center w-100">
                    <div className="products-list__item flex-1">
                      <div className="product-list-img">
                        <img alt="" src={getProductImgUrl(selectedProduct)} />
                      </div>
                      <div className="flex-1">
                        <h3 className="flex justify-between">
                          <span>{getProductName(selectedProduct)}</span>
                          <span>{formattedProductPrice(selectedProduct)}</span>
                        </h3>
                        <div>
                          <span className="tag">{selectedProduct?.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="quote-details">
                    <div className="quote-detail-item">
                      <span>Cost</span>
                      <span>
                        {!selectedProduct.wholesalePrice && selectedProduct.wholesalePrice !== 0 ? '-' : moneyFormatter.format(selectedProduct.wholesalePrice)}
                      </span>
                    </div>
                    <div className="quote-detail-item">
                      <span>{`Listed Price(${calcPercentage(formattedProductPrice(selectedProduct), selectedProduct.wholesalePrice)}%)`}</span>
                      <span>{formattedProductPrice(selectedProduct)}</span>
                    </div>
                    <div className="quote-detail-item">
                      <span>{`Quoted Price(${calcPercentage(quotedPrice, selectedProduct.wholesalePrice)}%)`}</span>
                      <input
                        value={formatMoney(quotedPrice)}
                        onChange={
                          (e) => setQuotedPrice(reformatMoney(e.target.value))
                        }
                      />
                    </div>
                    <div className="quote-detail-item">
                      <span>Shipping cost</span>
                      <input
                        value={formatMoney(shipping)}
                        onChange={
                          (e) => setShipping(reformatMoney(e.target.value))
                        }
                      />
                    </div>
                    <div className="quote-detail-item">
                      <span>Discounts</span>
                      <input
                        value={formatMoney(discount)}
                        onChange={
                          (e) => setDiscounts(reformatMoney(e.target.value))
                        }
                      />
                    </div>
                    <div className="quote-detail-item">
                      <span>Taxes</span>
                      <input
                        value={formatMoney(taxes)}
                        onChange={
                          (e) => setTaxes(reformatMoney(e.target.value))
                        }
                      />
                    </div>
                    <div className="quote-detail-item">
                      <span>Other fees</span>
                      <input
                        value={formatMoney(fees)}
                        onChange={
                          (e) => setFees(reformatMoney(e.target.value))
                        }
                      />
                    </div>
                  </div>
                  <div className="quote-detail-item total">
                    <span>
                      {`Selling Price (${calcPercentage(Number(shipping)
                        + Number(quotedPrice)
                        + Number(taxes)
                        + Number(fees)
                        - Number(discount), selectedProduct.wholesalePrice)}%)`}
                    </span>
                    <span>
                      {moneyFormatter
                        .format(Number(shipping)
                        + Number(quotedPrice)
                        + Number(taxes)
                        + Number(fees)
                        - Number(discount))}
                    </span>
                  </div>
                </div>
              </TabPanel>
              <TabPanel index={2} value={activeMenu}>
                <div className="input-group">
                  <Input
                    label="Subject"
                    fullWidth
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <Input
                    label="Message"
                    fullWidth
                    multiline
                    rows="24"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </TabPanel>
              <TabPanel index={3} value={activeMenu}>
                <div className="quote-preview-container">
                  <QuoteTemplate
                    client={client}
                    quotePreview={quotePreview}
                    taxes={taxes}
                    shipping={shipping}
                    discount={discount}
                    fees={fees}
                    quotedPrice={quotedPrice}
                  />
                </div>
              </TabPanel>
              <div className="flex items-center justify-between">
                <div>
                  {activeMenu > 0 && activeMenu !== steps.length
                  && (
                    <Button
                      color="secondary"
                      onClick={previous}
                    >
                      Previous
                    </Button>
                  )}
                </div>
                {activeMenu <= steps.length - 2
                && (
                  <Button
                    className="justify-end"
                    disabled={!selectedProduct.id
                      || (activeMenu === 1 && !quotedPrice)}
                    onClick={next}
                  >
                    Continue
                  </Button>
                )}
                {steps.length - 1 === activeMenu
                  && (
                    <Button
                      onClick={onPreview}
                      disabled={!subject}
                    >
                      Preview Quote
                    </Button>
                  ) }
                {steps.length === activeMenu
                && (
                  <Button
                    onClick={onSend}
                    disabled={sending}
                  >
                    {sending ? 'Sending...'
                      : 'Send to Customer' }
                  </Button>
                ) }
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <QuotePreviewModal
        isOpen={isQuotePreviewModal}
        toggle={toggleisQuotePreviewModal}
        shippingPrice={shippingPrice}
        toggleCreateModal={toggle}
        {...props}
      />
      <ConfirmationModal
        isOpen={isConfirmModal}
        toggle={toggleConfirmModal}
        onConfirm={closeQuote}
      />
    </>
  );
};

CreateQuotedModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default CreateQuotedModal;
