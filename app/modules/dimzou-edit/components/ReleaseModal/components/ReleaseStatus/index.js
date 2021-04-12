import React from 'react';
import PropTypes from 'prop-types';
import FeatModal from '@feat/feat-ui/lib/feat-modal';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import rMessages from '../../messages';

export default function ReleaseStatus(props) {
  return (
    <FeatModal fixedHeight>
      <FeatModal.Wrap>
        <FeatModal.Header>
          <FeatModal.Title>
            <TranslatableMessage message={rMessages[`${props.status}Hint`]} />
          </FeatModal.Title>
        </FeatModal.Header>
      </FeatModal.Wrap>
    </FeatModal>
  );
}

ReleaseStatus.propTypes = {
  status: PropTypes.string,
};
