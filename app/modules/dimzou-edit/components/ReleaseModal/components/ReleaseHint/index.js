import React from 'react';

import FeatModal from '@feat/feat-ui/lib/feat-modal';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import rMessages from '../../messages';

export default function ReleaseHint() {
  return (
    <FeatModal>
      <FeatModal.Wrap>
        <FeatModal.Header>
          <FeatModal.Title>
            <TranslatableMessage message={rMessages.releasingHint} />
          </FeatModal.Title>
        </FeatModal.Header>
      </FeatModal.Wrap>
    </FeatModal>
  )
}

