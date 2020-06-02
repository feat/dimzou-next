import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import get from 'lodash/get';

import { formatMessage } from '@/services/intl';

import FtBlock from '@feat/feat-ui/lib/block';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import ServicePriceItem from '@/components/ServicePriceItem';

import {
  SERVICE_TYPE_WORKPLACE,
  SERVICE_TYPE_ONLINE,
  SERVICE_TYPE_ON_SITE,
} from '@/modules/commerce/constants';

import {
  servicePriceUnit as servicePriceUnitMessages,
  serviceType as serviceTypeMessages,
} from '@/modules/commerce/messages';

import intlMessages from './messages';
import './index.scss';

class ViewServiceTable extends Component {
  initOrderCreation = (expertise, serviceItem) => {
    this.props.initOrderCreation({
      expertiseId: expertise.id,
      serviceType: serviceItem.type,
      expertise,
      serviceItem,
    });
  };

  renderServiceItem(record, type) {
    const serviceItem = record.available_services.find(
      (item) => item.type === type,
    );

    if (!serviceItem || !serviceItem.is_available) {
      return <ServicePriceItem isAvailable={false} />;
    }

    return (
      <ServicePriceItem
        price={serviceItem.converted_price || serviceItem.price}
        unit={formatMessage(servicePriceUnitMessages[serviceItem.unit])}
        isAvailable={serviceItem.is_available}
        onClick={() => {
          this.initOrderCreation(record, serviceItem);
        }}
      />
    );
  }

  render() {
    const { className, data } = this.props;
    const availableService = data.find((item) => item.available_services && item.available_services.length);
    const currency = availableService && get(availableService, ['available_services', '0', 'converted_currency']);
    return (
      <FtBlock
        noPadding
        className={classNames('ViewServiceTable', className)}
        title={
          <span className="padding_l_5">
            <TranslatableMessage message={intlMessages.sectionTitle} />
          </span>
        }
        subHeader={[
          <div className="ViewServiceTable__priceItem" key="online">
            <TranslatableMessage
              message={serviceTypeMessages[SERVICE_TYPE_ONLINE]}
            />
          </div>,
          <div className="ViewServiceTable__priceItem" key="on-site">
            <TranslatableMessage
              message={serviceTypeMessages[SERVICE_TYPE_ON_SITE]}
            />
          </div>,
          <div className="ViewServiceTable__priceItem" key="workplace">
            <TranslatableMessage
              message={serviceTypeMessages[SERVICE_TYPE_WORKPLACE]}
            />
          </div>,
        ]}
      >
        {data.map((record) => (
          <div className="ViewServiceTable__row" key={record.id}>
            <div className="ViewServiceTable__title">
              <span>{record.name}</span>
            </div>
            <div className="ViewServiceTable__priceItem">
              {this.renderServiceItem(record, SERVICE_TYPE_ONLINE)}
            </div>
            <div className="ViewServiceTable__priceItem">
              {this.renderServiceItem(record, SERVICE_TYPE_ON_SITE)}
            </div>
            <div className="ViewServiceTable__priceItem">
              {this.renderServiceItem(record, SERVICE_TYPE_WORKPLACE)}
            </div>
          </div>
        ))}
        {currency && <div className="ViewServiceTable__footer">Currency: {currency}</div>}
      </FtBlock>
    );
  }
}

ViewServiceTable.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
  initOrderCreation: PropTypes.func,
};

export default ViewServiceTable;
