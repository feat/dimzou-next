import React from 'react';
import PropTypes from 'prop-types';

import FeatModal from '@feat/feat-ui/lib/feat-modal';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import Button from '@feat/feat-ui/lib/button';

import rMessages from '../../messages';

export default function ReleaseValidating(props) {
  return (
    <FeatModal>
      <FeatModal.Wrap>
        <FeatModal.Header>
          <FeatModal.Title>
            <TranslatableMessage message={rMessages.releaseTypeTitle} />
          </FeatModal.Title>
        </FeatModal.Header>
        <FeatModal.Content>
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', paddingLeft: 48, paddingRight: 48, paddingBottom: 48, justifyContent: 'space-around'}}> 
            <Button
              style={{ width: 200, height: 200 }}
              onClick={props.initStandaloneReleaseFlow}
            >
              <TranslatableMessage message={rMessages.standaloneRelease} />
            </Button>
            <Button
              style={{ width: 200, height: 200 }}   
              onClick={props.initBundleReleaseFlow}
            >
              <TranslatableMessage message={rMessages.bundleRelease} />
            </Button>
          </div>
        </FeatModal.Content>
      </FeatModal.Wrap>
    </FeatModal>
  )
}

ReleaseValidating.propTypes = {
  initStandaloneReleaseFlow: PropTypes.func,
  initBundleReleaseFlow: PropTypes.func,
}