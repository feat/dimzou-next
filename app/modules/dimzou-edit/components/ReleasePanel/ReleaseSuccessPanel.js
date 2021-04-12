import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@feat/feat-ui/lib/button';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import { release as rMessages } from '../../messages';

function ReleaseSuccessPanel(props) {
  const [left, setLeft] = useState(props.autoCloseCountdown);
  useEffect(
    () => {
      if (left === 0) {
        props.onClose();
        return;
      }
      const timer = setTimeout(() => {
        setLeft(left - 1);
      }, 1000);
      // eslint-disable-next-line consistent-return
      return () => {
        clearTimeout(timer);
      };
    },
    [left],
  );

  return (
    <div className="dz-ReleasePanel">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        <div>
          <div
            className="dz-ReleasePanel__title dz-ReleasePanel__title_status"
            style={{ marginBottom: 20 }}
          >
            <TranslatableMessage message={rMessages.releaseSuccessHint} />
          </div>
          <div className="dz-ReleasePanel__desc t-center">
            <Button onClick={props.onClose}>
              <TranslatableMessage message={rMessages.close} />
              {!!left && <span className="padding_l_5">( {left}s )</span>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

ReleaseSuccessPanel.propTypes = {
  onClose: PropTypes.func,
  autoCloseCountdown: PropTypes.number,
};

ReleaseSuccessPanel.defaultProps = {
  autoCloseCountdown: 5,
};

export default ReleaseSuccessPanel;
