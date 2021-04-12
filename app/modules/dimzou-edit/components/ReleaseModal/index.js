import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';

import Modal from '@feat/feat-ui/lib/modal';
import message from '@feat/feat-ui/lib/message';

import CategorySelectModal from '@/modules/category/containers/CategorySelectModal';
import { delay } from '@/utils/control';
import ReleaseApplyScenes from './components/ReleaseApplyScenes';
import ReleaseReview from './components/ReleaseReview';
import ReleaseStatus from './components/ReleaseStatus';
import ReleaseNodeSelect from './components/ReleaseNodeSelect';
import ReleaseValidationFailed from './components/ReleaseValidationFailed';
import ReleaseFailed from './components/ReleaseFailed';

import { selectWorkspaceState } from '../../selectors';
import {
  exitRelease,
  setReleaseData,
  setReleaseStep,
  asyncPreRelease,
  asyncSetApplyScenes,
  asyncRelease,
} from '../../actions';
import intlMessages from './messages';

import './style.scss';

function ReleaseModal() {
  const { formatMessage } = useIntl();
  const isReleasePanelOpened = useSelector(
    (state) => selectWorkspaceState(state).isReleasePanelOpened,
  );
  const releaseContext = useSelector(
    (state) => selectWorkspaceState(state).releaseContext,
  );
  const dispatch = useDispatch();
  if (!isReleasePanelOpened || !releaseContext) {
    return null;
  }
  let panel;
  switch (releaseContext.step) {
    case 'category':
      panel = (
        <CategorySelectModal
          category={
            releaseContext.category || releaseContext.initialValues.category
          }
          onConfirm={({ category }) => {
            if (!category) {
              message.error(formatMessage(intlMessages.selectCategoryHint));
              return;
            }
            dispatch(
              setReleaseData({
                category,
              }),
            );
            dispatch(setReleaseStep('review'));
          }}
        />
      );
      break;
    case 'applyScenes':
      panel = (
        <ReleaseApplyScenes
          data={
            releaseContext.applyScenes ||
            releaseContext.initialValues.applyScenes
          }
          onConfirm={(data) => {
            dispatch(
              setReleaseData({
                applyScenes: data,
              }),
            );
            dispatch(setReleaseStep('review'));
          }}
        />
      );
      break;
    case 'review':
      panel = (
        <ReleaseReview
          bundle={releaseContext.bundle}
          nodes={releaseContext.nodes}
          category={
            releaseContext.category || releaseContext.initialValues.category
          }
          applyScenes={
            releaseContext.applyScenes ||
            releaseContext.initialValues.applyScenes
          }
          onApplyScenesChange={(values) => {
            dispatch(
              setReleaseData({
                applyScenes: values,
              }),
            );
          }}
          initSelectCategory={() => {
            dispatch(setReleaseStep('category'));
          }}
          onConfirm={async () => {
            // release flow
            const { bundle, nodes, category, applyScenes } = releaseContext;
            const nodeIds = nodes.map((item) => item.id);
            dispatch(setReleaseStep('validating'));
            try {
              await dispatch(
                asyncPreRelease({
                  bundleId: bundle.id,
                  data: nodeIds,
                }),
              );
            } catch (err) {
              dispatch(setReleaseData({ validationError: err }));
              dispatch(setReleaseStep('validationFailed'));
              return;
            }
            dispatch(setReleaseStep('releasing'));
            try {
              if (applyScenes) {
                await dispatch(
                  asyncSetApplyScenes({
                    bundleId: bundle.id,
                    data: applyScenes.map((item) => item.label),
                  }),
                );
              }
              await dispatch(
                asyncRelease({
                  bundleId: bundle.id,
                  data: {
                    nodes: nodeIds,
                    category: category || releaseContext.initialValues.category,
                  },
                }),
              );
              dispatch(setReleaseStep('releaseSuccess'));

              // open publication
              const pubUrl = `${window.location.origin}/dimzou/${bundle.id}`;
              window.open(pubUrl);

              // close modal
              await delay(2000);
              dispatch(exitRelease());
            } catch (err) {
              dispatch(setReleaseData({ releaseError: err }));
              dispatch(setReleaseStep('releaseFailed'));
            }
          }}
        />
      );
      break;
    case 'validationFailed':
      panel = (
        <ReleaseValidationFailed
          nodes={releaseContext.nodes}
          error={releaseContext.validationError}
          onConfirm={() => {
            dispatch(exitRelease());
          }}
        />
      );
      break;
    case 'releaseFailed':
      panel = (
        <ReleaseFailed
          error={releaseContext.releaseError}
          onConfirm={() => {
            dispatch(exitRelease());
          }}
        />
      );
      break;
    case 'validating':
    case 'releasing':
    case 'releaseSuccess':
      panel = <ReleaseStatus status={releaseContext.step} />;
      break;
    case 'nodesSelect':
      panel = (
        <ReleaseNodeSelect
          nodes={releaseContext.bundle.nodes}
          selected={releaseContext.nodes}
          onConfirm={(data) => {
            if (data.length === 0) {
              message.error(formatMessage(intlMessages.nodesRequired));
              return;
            }
            dispatch(
              setReleaseData({
                nodes: data,
              }),
            );
            dispatch(setReleaseStep('category'));
          }}
        />
      );
      break;
    default:
      logging.warn(`UNKNOWN STEP: ${releaseContext.step}`);
  }

  return (
    <Modal
      isOpen={isReleasePanelOpened}
      onClose={() => {
        dispatch(exitRelease());
      }}
      maskClosable
    >
      {panel}
    </Modal>
  );
}

export default ReleaseModal;
