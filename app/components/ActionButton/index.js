import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ButtonBase from '@feat/feat-ui/lib/button/ButtonBase';

import { ReactComponent as OKIcon } from './icons/ok.svg';
import { ReactComponent as NoIcon } from './icons/no.svg';
const iconMap = {
  ok: OKIcon,
  no: NoIcon,
};

const ActionButton = React.forwardRef((props, ref) => {
  const { type, size, className, htmlType, ...rest } = props;
  const Icon = iconMap[type];
  return (
    <ButtonBase
      className={classNames(className, {
        [`size_${size}`]: size,
      })}
      ref={ref}
      type={htmlType}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    >
      <Icon />
    </ButtonBase>
  );
});

ActionButton.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  type: PropTypes.oneOf(['ok', 'no']),
  htmlType: PropTypes.oneOf(['button', 'submit']),
};

ActionButton.defaultProps = {
  size: 'sm',
  htmlType: 'button',
};
export default ActionButton;
