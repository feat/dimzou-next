import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@feat/feat-ui/lib/button/IconButton';
import FeatModal from '@feat/feat-ui/lib/feat-modal';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import rMessages from '../../messages';

export default function ReleaseError(props) {
  const { error, onConfirm } = props;
  return (
    <FeatModal>
      <FeatModal.Wrap>
        <FeatModal.Header>
          <FeatModal.Title>
            <TranslatableMessage message={rMessages.releaseFailed} />
          </FeatModal.Title>
        </FeatModal.Header>
        <FeatModal.Content>
          {error.message}
        </FeatModal.Content>
        <FeatModal.Footer>
          <IconButton
            svgIcon="ok-btn"
            size="md"
            onClick={onConfirm}
          />
        </FeatModal.Footer>
      </FeatModal.Wrap>
    </FeatModal>
  )
}

ReleaseError.propTypes = {
  error: PropTypes.object,
  onConfirm: PropTypes.func,
}