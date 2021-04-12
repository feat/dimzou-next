import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import Router from 'next/router';
import { useIntl } from 'react-intl';

import Modal from '@feat/feat-ui/lib/modal';
import Button from '@feat/feat-ui/lib/button';
import FeatModal from '@feat/feat-ui/lib/feat-modal';
import message from '@feat/feat-ui/lib/message';
import notification from '@feat/feat-ui/lib/notification';
import CategorySelectModal from '@/modules/category/containers/CategorySelectModal';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import ActionButton from '@/components/ActionButton';
import ApplyScenesInput from '../ApplyScenesInput';
import { WorkspaceContext } from '../../context';
import {
  exitSectionRelease,
  setSectionReleaseData,
  asyncSectionRelease,
} from '../../actions';
import rMessages from '../ReleaseModal/messages';
import ReleaseCard from './ReleaseCard';

import { getAsPath } from '../../utils/router';

import './style.scss';

function SectionReleasePanel() {
  const { formatMessage } = useIntl();
  const {
    isSectionReleasePanelOpened,
    isSectionReleasing,
    sectionReleaseContext,
  } = useContext(WorkspaceContext);
  const [isCategorySelectOpened, setCategorySelectOpened] = useState(false);

  const dispatch = useDispatch();
  if (!isSectionReleasePanelOpened) {
    return null;
  }
  const { category, applyScenes } = sectionReleaseContext;
  let content;
  if (isCategorySelectOpened) {
    content = (
      <CategorySelectModal
        category={category}
        onConfirm={({ category }) => {
          if (!category) {
            message.error(formatMessage(rMessages.selectCategoryHint));
            return;
          }
          dispatch(
            setSectionReleaseData({
              category,
            }),
          );
          setCategorySelectOpened(false);
        }}
      />
    );
  } else {
    content = (
      <FeatModal fixedHeight>
        <FeatModal.Wrap>
          <FeatModal.Header>
            <FeatModal.Title>
              <TranslatableMessage message={rMessages.sectionRelease} />
            </FeatModal.Title>
          </FeatModal.Header>
          <FeatModal.Content>
            <div className="dz-ReleaseReview dz-ReleaseReview_section">
              <div className="dz-ReleaseReview__info">
                <ReleaseCard
                  initialValues={sectionReleaseContext}
                  onChange={(values) => {
                    dispatch(setSectionReleaseData(values));
                  }}
                />
              </div>
              <div className="dz-ReleaseReview__config">
                <div className="dz-ReleaseReview__field">
                  <div className="dz-ReleaseReview__label">
                    <TranslatableMessage message={rMessages.category} />
                  </div>
                  <div className="dz-ReleaseReview__item">
                    <Button
                      onClick={() => {
                        setCategorySelectOpened(true);
                      }}
                    >
                      {category ? (
                        <TranslatableMessage
                          message={{
                            id: `category.${category.slug}`,
                            defaultMessage: category.name,
                          }}
                        />
                      ) : (
                        <span className="t-placeholder">
                          <TranslatableMessage
                            message={rMessages.selectCategoryHint}
                          />
                        </span>
                      )}
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
                    onChange={(values) => {
                      dispatch(
                        setSectionReleaseData({
                          applyScenes: values,
                        }),
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </FeatModal.Content>
          <FeatModal.Footer>
            <ActionButton
              type="ok"
              size="md"
              disabled={isSectionReleasing}
              data-type="action"
              data-button-style="icon"
              onClick={() => {
                if (!sectionReleaseContext.title) {
                  message.error(formatMessage(rMessages.titleRequired));
                  return;
                }
                if (!sectionReleaseContext.summary) {
                  message.error(formatMessage(rMessages.summaryRequired));
                  return;
                }
                if (!sectionReleaseContext.category) {
                  message.error(formatMessage(rMessages.selectCategoryHint));
                  return;
                }
                if (!sectionReleaseContext.cover) {
                  message.error(formatMessage(rMessages.coverRequired));
                  return;
                }
                dispatch(asyncSectionRelease(sectionReleaseContext))
                  .then((publication) => {
                    const href = {
                      pathname: '/dimzou-edit',
                      query: {
                        pageName: 'view',
                        bundleId: publication.bundle_id,
                        nodeId: publication.node_id,
                      },
                    };
                    Router.push(href, getAsPath(href));
                  })
                  .catch((err) => {
                    notification.error({
                      message: 'Error',
                      description: err.message,
                    });
                  });
              }}
            />
          </FeatModal.Footer>
        </FeatModal.Wrap>
      </FeatModal>
    );
  }

  if (isSectionReleasePanelOpened) {
    return (
      <Modal
        isOpen={isSectionReleasePanelOpened}
        onClose={() => {
          dispatch(exitSectionRelease());
        }}
        maskClosable
      >
        {content}
      </Modal>
    );
  }
  return null;
}

export default SectionReleasePanel;
