import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { injectIntl } from 'react-intl';
import message from '@feat/feat-ui/lib/message';
import SquareButton from '@feat/feat-ui/lib/button/SquareButton';

import ActionButton from '@/components/ActionButton';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import ApplyScenesInput from '../ApplyScenesInput';
import dzMessages from '../../messages';

import './style.scss';

function ApplyScenesPanel(props) {
  const {
    onCancel,
    onSubmit,
    onTerminate,
    applyScenes,
    required,
    intl,
  } = props;
  const [data, setData] = useState(applyScenes || []);

  const handleSubmit = () => {
    if (required && !data.length) {
      //  message info...
      message.error(intl.formatMessage(dzMessages.inputApplyScenesHint));
      return;
    }
    onSubmit(data);
  };

  return (
    <div className="dz-ReleasePanel dz-ApplyScenesPanel">
      <div className="dz-ReleasePanel__header">
        <div className="dz-ReleasePanel__title">
          <TranslatableMessage message={dzMessages.applyScenesLabel} />
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
      <div className="dz-ReleasePanel__content dz-ApplyScenesPanel__content">
        <div className="dz-ApplyScenesPanel__desc">
          <TranslatableMessage message={dzMessages.applyScenesDesc} />
        </div>
        <div className="dz-ApplyScenesPanel__input">
          <ApplyScenesInput
            autoFocus
            value={data}
            onChange={(values) => {
              setData(values);
            }}
          />
        </div>
      </div>
      <div className="dz-ReleasePanel__footer">
        <div className="dz-ReleasePanel__actions">
          <ActionButton
            className="margin_r_24"
            type="no"
            size="sm"
            onClick={onCancel}
          />
          <ActionButton type="ok" size="sm" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

ApplyScenesPanel.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  onTerminate: PropTypes.func,
  applyScenes: PropTypes.array,
  required: PropTypes.bool,
  intl: PropTypes.object,
};

export default injectIntl(ApplyScenesPanel);
