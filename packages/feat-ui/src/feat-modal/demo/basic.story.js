import React from 'react';

import FeatModal from '@feat/feat-ui/lib/feat-modal';
import IconButton from '@feat/feat-ui/lib/button/IconButton';

const Example = (props) => (
  <div
    style={{
      backgroundColor: '#f3f3f3',
      padding: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <FeatModal>
      <FeatModal.Wrap>
        <FeatModal.Header>
          <FeatModal.Title>Modal Header</FeatModal.Title>
        </FeatModal.Header>
        <FeatModal.Content>Panel</FeatModal.Content>
        <FeatModal.Footer>
          <IconButton svgIcon="no-btn" size="md" className="margin_r_24" />
          <IconButton svgIcon="ok-btn" size="md" />
        </FeatModal.Footer>
      </FeatModal.Wrap>
    </FeatModal>
  </div>
);

export default Example;
