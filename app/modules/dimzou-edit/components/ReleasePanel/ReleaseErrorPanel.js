import React from 'react';
import PropTypes from 'prop-types';
import SquareButton from '@feat/feat-ui/lib/button/SquareButton';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import { release as rMessages } from '../../messages';

function ReleaseErrorPanel(props) {
  const { onTerminate, content } = props;
  return (
    <div className="dz-ReleasePanel dz-CategoryPanel">
      <div className="dz-ReleasePanel__header">
        <div className="dz-ReleasePanel__title">
          <TranslatableMessage message={rMessages.releaseFailed} />
        </div>
        {onTerminate && (
          <SquareButton
            className="dz-ReleasePanel__exitBtn"
            type="dashed"
            onClick={onTerminate}
          >
            &times;
          </SquareButton>
        )}
      </div>
      <div className="dz-ReleasePanel__content">{content}</div>
    </div>
  );
}

ReleaseErrorPanel.propTypes = {
  onTerminate: PropTypes.func,
  content: PropTypes.any,
};

export default ReleaseErrorPanel;
