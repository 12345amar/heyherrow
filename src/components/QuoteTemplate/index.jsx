import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import './index.scss';
import getFullName from '../../utils/getFullName';
import getProductName from '../../utils/getProductName';
import moneyFormatter from '../../utils/moneyFormatter';

const QuoteTemplate = ({
  client,
  quotePreview,
  discount,
  shipping,
  taxes,
  fees,
  quotedPrice
}) => (
  <div className="outer-border">
    <div className="page-container">
      <header>
        <div className="top-address">
          <div className="brand">
            <div className="brand-logo">
              <img src={client.logo} alt="logo" />
            </div>
            <h1>{client.name}</h1>
          </div>
          <p />
          <hr />
        </div>
      </header>
      <div className="quote-detail">
        <div className="date" style={{ width: '98%' }}>
          <span style={{ fontWeight: 'lighter' }}>
            {quotePreview?.customer?.accountName}
            <br />
            c/o
            {' '}
            <span className="dark">{getFullName(quotePreview.customer)}</span>
            <br />
            {quotePreview?.customer?.phone}
            <br />
            {quotePreview?.customer?.email}
          </span>
          <br />
          <br />
          <table style={{
            fontSize: '10px',
            float: 'left',
            fontWeight: 'normal',
            width: '50%'
          }}
          >
            <tr>
              <td style={{ height: '21px' }}>Date:</td>
              <td style={{ height: '21px' }}>{moment(quotePreview.date).format('MM/DD/YYYY')}</td>
            </tr>
            <tr>
              <td style={{ height: '28px' }}>
                <span lang="en-in">Quote ID</span>
                :
              </td>
              <td style={{ height: '28px' }}>{quotePreview.serialNumber}</td>
            </tr>
            <tr>
              <td style={{ height: '19px' }}>
                Valid thru:
                {' '}
                {' '}
              </td>
              <td style={{ height: '19px' }}>{moment(new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000))).format('MM/DD/YYYY')}</td>
            </tr>
          </table>
        </div>

        <div className="quote-detail-left">
          <div className="quote-address">
            <br />
            {' '}
            <br />
            {' '}
            <br />
            <p>
              <span className="dark">{getFullName(quotePreview?.customer?.salesRep)}</span>
              <br />
              {quotePreview?.customer?.salesRep?.phoneNumber}
              <br />
              {quotePreview.customer?.salesRep?.email}
            </p>
          </div>
        </div>
      </div>
      <div className="product-date" style={{ width: '100%' }}>
        <table className="product">
          <thead>
            <th>
              <strong>
                Q
                <span lang="en-in">TY</span>
              </strong>
            </th>
            <th>
              <strong>
                D
                <span lang="en-in">ESCRIPTION</span>
              </strong>
            </th>
            <th>
              <strong>
                T
                <span lang="en-in">AXABLE</span>
              </strong>
            </th>
            <th>
              <strong>
                U
                <span lang="en-in">NIT PRICE</span>
              </strong>
            </th>
            <th>
              <strong>
                <span lang="en-in">TOTAL</span>
              </strong>
            </th>
          </thead>
          <tr>
            <td className="lighter">1</td>
            <td className="lighter">{`${getProductName(quotePreview.product)}`}</td>
            <td className="lighter">-</td>
            <td className="lighter">{moneyFormatter.format(quotedPrice)}</td>
            <td className="lighter">{moneyFormatter.format(quotedPrice)}</td>
          </tr>
        </table>
        <table
          className="auto-style19"
          style={{
            borderStyle: 'none',
            borderColor: 'inherit',
            borderWidth: 'thick',
            width: '35%',
            fontSize: '10px',
            lineHeight: '11.5px',
            marginTop: '22px',
            marginBottom: '22px'
          }}
        >
          <tr>
            <td style={{ width: '120px' }} className="auto-style31">
              <strong>Sub Total</strong>
            </td>
            <td className="auto-style20">
              <span>
                <strong>{moneyFormatter.format(quotedPrice)}</strong>
              </span>
            </td>
          </tr>
          <tr>
            <td className="auto-style31" style={{ width: '120px' }}>
              Discount
            </td>
            <td className="auto-style20">{moneyFormatter.format(discount)}</td>
          </tr>
          <tr>
            <td className="auto-style31" style={{ width: '120px' }}>
              Taxes
            </td>
            <td className="auto-style20">
              <span>{moneyFormatter.format(taxes)}</span>
            </td>
          </tr>
          <tr>
            <td className="auto-style31" style={{ width: '120px' }}>
              Shipping Cost
            </td>
            <td className="auto-style20">
              <span>{moneyFormatter.format(shipping)}</span>
            </td>
          </tr>
          <tr>
            <td
              className="auto-style30"
              style={{ width: '120px', borderBottomWidth: 'medium' }}
            >
              Other fees
            </td>
            <td className="lighter" style={{ borderBottomWidth: 'medium' }}>
              {moneyFormatter.format(fees)}
            </td>
          </tr>
          <tr>
            <td className="auto-style29" style={{ width: '120px', fontWeight: 'bold' }}>
              Net Price
            </td>
            <td className="red" style={{ fontWeight: 'bold' }}>
              {moneyFormatter
                .format(Number(shipping)
                        + Number(quotedPrice)
                        + Number(taxes)
                        + Number(fees)
                        - Number(discount))}
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
);

QuoteTemplate.propTypes = {
  client: PropTypes.objectOf(PropTypes.any).isRequired,
  quotePreview: PropTypes.objectOf(PropTypes.any).isRequired,
  taxes: PropTypes.number.isRequired,
  fees: PropTypes.number.isRequired,
  discount: PropTypes.number.isRequired,
  shipping: PropTypes.number.isRequired,
  quotedPrice: PropTypes.number.isRequired
};

export default QuoteTemplate;
