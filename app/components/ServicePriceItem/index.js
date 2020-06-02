import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.scss';

class ServicePriceItem extends React.PureComponent {
  render() {
    const { price, unit, isAvailable, canEdit, ...restProps } = this.props;
    const isDisabled = canEdit ? false : !isAvailable;

    return (
      <button
        type="button"
        className={classNames('ServicePriceItem', {
          'is-disabled': isDisabled,
        })}
        {...restProps}
      >
        {isAvailable
          ? [
            <span className="ServicePriceItem__unit" key="unit">
              {unit}
            </span>,
            <span className="ServicePriceItem__price" key="price">
              {price}
            </span>,
          ]
          : '--'}
      </button>
    );
  }
}

ServicePriceItem.propTypes = {
  price: PropTypes.node,
  unit: PropTypes.node,
  isAvailable: PropTypes.bool,
  canEdit: PropTypes.bool,
};

export default ServicePriceItem;
