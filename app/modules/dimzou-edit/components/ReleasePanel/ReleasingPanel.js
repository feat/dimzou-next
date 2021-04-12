import React from 'react';
import PropTypes from 'prop-types';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import Loader from '@feat/feat-ui/lib/loader';
import { release as rMessages } from '../../messages';

export default function ReleasingPanel(props) {
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
            <TranslatableMessage message={rMessages.releasingHint} />
          </div>
          <div className="dz-ReleasePanel__desc t-center">{props.message}</div>
        </div>
      </div>
    </div>
  );
}

ReleasingPanel.propTypes = {
  message: PropTypes.element,
};

ReleasingPanel.defaultProps = {
  message: (
    <div className="t-center">
      <Loader size="xs" />
    </div>
  ),
};
