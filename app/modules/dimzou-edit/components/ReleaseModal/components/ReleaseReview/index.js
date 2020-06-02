import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@feat/feat-ui/lib/button/IconButton';
import Button from '@feat/feat-ui/lib/button';
import FeatModal from '@feat/feat-ui/lib/feat-modal';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import ApplyScenesInput from '../../../ApplyScenesInput';
import rMessages from '../../messages';

export default function ReleaseReview(props) {
  const { category, bundle, applyScenes, onConfirm, initSelectCategory, onApplyScenesChange } = props;
  return (
    <FeatModal>
      <FeatModal.Wrap>
        <FeatModal.Header>
          <FeatModal.Title>
            <TranslatableMessage message={rMessages.review} />
          </FeatModal.Title>
        </FeatModal.Header>
        <FeatModal.Content>
          <div className="dz-ReleaseReview">
            <div className="dz-ReleaseReview__info">
              <div className='dz-ReleaseBundleInfo typo-Article'>
                <h2 className="dz-ReleaseBundleInfo__title">{bundle.title}</h2>
                <p className="typo-Article__summary">{bundle.summary}</p>
              </div>
            </div>
            <div className="dz-ReleaseReview__config">
              <div className="dz-ReleaseReview__field">
                <div className="dz-ReleaseReview__label">
                  <TranslatableMessage message={rMessages.category} />
                </div>
                <div className="dz-ReleaseReview__item">
                  <Button
                    onClick={initSelectCategory}
                  >
                    <TranslatableMessage
                      message={{
                        id: `category.${category.slug}`,
                        defaultMessage: category.name,
                      }}
                    />
                  </Button>
                </div>
              </div>
              <div className="dz-ReleaseReview__label">
                <TranslatableMessage message={rMessages.applyScenes} />
              </div>
              <div className="dz-ReleaseReview__item">
                <ApplyScenesInput
                  autoFocus={!!category}
                  value={applyScenes || []}
                  onChange={onApplyScenesChange}
                />
              </div>
            </div>
          </div>
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

ReleaseReview.propTypes = {
  bundle: PropTypes.array,
  category: PropTypes.object,
  applyScenes: PropTypes.array,
  onConfirm: PropTypes.func,
  initSelectCategory: PropTypes.func,
  onApplyScenesChange: PropTypes.func,
}