import React from 'react';
import PropTypes from 'prop-types';

import FeatModal from '@feat/feat-ui/lib/feat-modal';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import ActionButton from '@/components/ActionButton';
import rMessages from '../../messages';

export default function ReleaseError(props) {
  const { error, onConfirm } = props;
  return (
    <FeatModal fixedHeight>
      <FeatModal.Wrap>
        <FeatModal.Header>
          <FeatModal.Title>
            <TranslatableMessage message={rMessages.releaseFailed} />
          </FeatModal.Title>
        </FeatModal.Header>
        <FeatModal.Content>{error.message}</FeatModal.Content>
        <FeatModal.Footer>
          <ActionButton
            type="ok"
            size="md"
            data-type="action"
            data-button-style="icon"
            onClick={onConfirm}
          />
        </FeatModal.Footer>
      </FeatModal.Wrap>
    </FeatModal>
  );
}

ReleaseError.propTypes = {
  error: PropTypes.object,
  onConfirm: PropTypes.func,
};
