import React, {
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import get from 'lodash/get';
import { NativeTypes } from 'react-dnd-html5-backend';

import notification from '@feat/feat-ui/lib/notification';
import message, { getMessageInstance } from '@feat/feat-ui/lib/message';
import AppDndHandlerService from '@/services/dnd/AppDndHandlerService';
import { AppDndContext } from '@/services/dnd/AppDndService';

import { useStateCallback } from '@/utils/hooks';

import {
  getTemplateCoverRatio,
  getTemplateCropInfo,
} from '../../utils/template';

import CoverCropper from '../CoverCropper';
import CoverPreview from './CoverPreview';
import CoverPlaceholder from './CoverPlaceholder';
import CoverThumbnail from './CoverThumbnail';

import FileDropzone from '../FileDropzone';
import CoverDropTips from '../CoverDropTips';

import { ATTACHMENT_MAX_SIZE, REWORDING_STATUS_PENDING } from '../../constants';
import './style.scss';
import readFileAsURL from '../../../../utils/readFileAsURL';
import intlMessages from '../../messages';

const preparePreview = (file) => {
  if (file.preview) {
    return Promise.resolve();
  }

  return readFileAsURL(file).then((url) => {
    // eslint-disable-next-line
    file.preview = url;
  });
};

function CoverBlockRender(props) {
  const {
    userCapabilities: { canEdit },
    intl: { formatMessage },
  } = props;
  const viewBoxRef = useRef(null);
  const wrapRef = useRef(null);
  const [state, setState] = useStateCallback({
    showContent: !!props.rewordings.length,
  });

  const submitEditContent = useCallback((cropOutput) => {
    const { template, blockState } = props;
    const payload = {
      template,
      content: {
        templates: {
          [template]: {
            cropData: cropOutput.data,
          },
        },
      },
      htmlContent: '<PLACEHOLDER>',
      croppedImage: cropOutput.croppedImage,
    };

    if (blockState.file) {
      payload.sourceImage = blockState.file;
    } else {
      payload.content.source = blockState.sourceImage;
    }
    props.postCoverRewording(payload);
  });

  const changeTargetedRewording = (
    targetedRewordingId,
    targetedRewordingPreviewIndex,
  ) => {
    props.updateBlockState({
      targetedRewordingId,
      targetedRewordingPreviewIndex,
    });
  };

  const handleCoverDropzone = useCallback((files) => {
    if (!canEdit) {
      return;
    }
    if (files.length) {
      // window.scrollTo(0, 0);
      const box =
        viewBoxRef.current && viewBoxRef.current.getBoundingClientRect();
      if (!box) {
        return;
      }
      const file = files[0];
      preparePreview(file)
        .then(() => {
          const info = {
            bundleId: props.bundleId,
            nodeId: props.nodeId,
            structure: props.structure,
            blockId: props.blockId,
            file,
            sourceImage: file.preview,
            box: {
              left: box.left,
              top: box.top,
              right: box.right,
              bottom: box.bottom,
              width: box.width,
              height: box.height,
            },
          };
          props.initBlockEdit(info);
        })
        .catch((err) => {
          notification.error({
            message: 'Error',
            description: err.message,
          });
          logging.error(err);
        });
    }
  });

  const toggleNavigatePanel = useCallback(() => {
    const { blockState } = props;
    props.updateBlockState({
      isNavigatePanelOpened: !blockState.isNavigatePanelOpened,
    });
  });

  const enterEdit = useCallback((rewording) => {
    if (!props.userCapabilities.canEdit) {
      return;
    }
    if (
      rewording.status === REWORDING_STATUS_PENDING &&
      rewording.user.uid !== props.currentUser.uid
    ) {
      message.info(formatMessage(intlMessages.canNotEditPendingRewording));
      return;
    }

    const { img } = rewording;

    const box =
      viewBoxRef.current && viewBoxRef.current.getBoundingClientRect();
    if (!box) {
      return;
    }
    const payload = {
      bundleId: props.bundleId,
      nodeId: props.nodeId,
      structure: props.structure,
      blockId: props.blockId,
      box: {
        left: box.left,
        top: box.top,
        right: box.right,
        bottom: box.bottom,
        width: box.width,
        height: box.height,
      },
      sourceImage: img,
      activeRewording: rewording,
      basedOn: rewording.id,
      updateRewording: rewording.status === REWORDING_STATUS_PENDING,
    };
    props.initBlockEdit(payload);
  }, null);

  const {
    blockState,
    template,
    rewordings,
    classifiedRewordings,
    userCapabilities: { canElect },
    currentUser,
    blockState: {
      isNavigatePanelOpened,
      targetedRewordingId,
      electingRewording,
    },
  } = props;

  const coverImage = get(props, 'info.origin', props.coverImage);
  const ratio = getTemplateCoverRatio(template);

  const versionArray = useMemo(
    () => {
      if (!rewordings || !rewordings.length) {
        return [];
      }
      const {
        currentVersion,
        candidateVersions,
        historicVersions,
        rejectedVersions,
      } = classifiedRewordings;
      return [
        ...(currentVersion ? [currentVersion] : []),
        ...candidateVersions,
        ...historicVersions,
        ...rejectedVersions,
      ];
    },
    [rewordings],
  );

  // GET Targeted rewordings
  let targetedRewordingIdWithDefault;
  if (targetedRewordingId) {
    targetedRewordingIdWithDefault = targetedRewordingId;
  } else if (classifiedRewordings.currentVersion) {
    targetedRewordingIdWithDefault = classifiedRewordings.currentVersion.id;
  } else {
    const userPending = classifiedRewordings.candidateVersions.find(
      (item) => item.user_id === currentUser.uid,
    );
    if (userPending) {
      targetedRewordingIdWithDefault = userPending.id;
    } else {
      targetedRewordingIdWithDefault = versionArray[0]
        ? versionArray[0].id
        : undefined;
    }
  }

  const shouldDisplayTips =
    !versionArray.length ||
    (versionArray.length &&
      versionArray[versionArray.length - 1].is_selected &&
      !versionArray[versionArray.length - 1].template_config);

  const shouldDisplayContent =
    !!rewordings.length || blockState.isEditModeEnabled;

  useEffect(
    () => {
      if (!wrapRef.current) {
        return;
      }
      const dom = wrapRef.current.querySelector('[data-is-selected=true]');
      if (!dom) {
        return;
      }
      const { offsetTop } = dom;
      wrapRef.current.style.transform = `translateY(-${offsetTop}px)`;
    },
    [targetedRewordingIdWithDefault, rewordings],
  );

  const appDndContext = useContext(AppDndContext);

  useEffect(
    // eslint-disable-next-line consistent-return
    () => {
      if (
        appDndContext.draggableIsFree &&
        appDndContext.itemType === NativeTypes.FILE
      ) {
        getMessageInstance().then((instance) => {
          instance.notice({
            key: 'dimzou-add-cover-notice',
            duration: null,
            content: '拖放图片并设置封面',
          });
        });
        return () => {
          getMessageInstance().then((instance) => {
            instance.removeNotice('dimzou-add-cover-notice');
          });
        };
      }
    },
    [appDndContext.draggableIsFree],
  );

  useEffect(
    () => {
      if (shouldDisplayContent) {
        return;
      }

      AppDndHandlerService.register(NativeTypes.FILE, {
        drop: (item, monitor) => {
          if (!monitor.didDrop) {
            return;
          }
          const result = monitor.getDropResult();
          if (result) {
            return;
          }
          const { files } = item;
          if (files.length && /image\/*/.test(files[0].type)) {
            window.scrollTo(0, 0);
            setState({ showContent: true }, () => {
              handleCoverDropzone(item.files);
            });
          }
        },
      });

      // eslint-disable-next-line consistent-return
      return () => {
        AppDndHandlerService.unregister(NativeTypes.FILE);
      };
    },
    [shouldDisplayContent],
  );

  const previewVisible =
    rewordings.length || state.showContent || blockState.isEditModeEnabled;

  const preview = (
    <div
      className="dz-CoverSection__wrap"
      style={previewVisible ? undefined : { maxHeight: 0, overflow: 'hidden' }}
    >
      <FileDropzone
        accept="image/*"
        maxSize={ATTACHMENT_MAX_SIZE * 1024 * 1024}
        onDrop={handleCoverDropzone}
        canDrop={(_, monitor) => monitor.isOver({ shallow: true })}
        multiple={false}
        noClick
      >
        {({ getRootProps, getInputProps, canDrop }) => (
          <div
            className={classNames('dz-CoverSection__dropzone', {
              'is-active': canDrop,
            })}
            style={{ paddingTop: `${100 / ratio}%` }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <div
              className={classNames('dz-CoverSection__viewBox')}
              ref={viewBoxRef}
            >
              {versionArray.length ? (
                <div className="dz-CoverSection__rewordingWrap" ref={wrapRef}>
                  {versionArray.map((record) => (
                    <CoverPreview
                      key={record.id}
                      bundleId={props.bundleId}
                      nodeId={props.nodeId}
                      structure={props.structure}
                      blockId={props.blockId}
                      isSelected={record.id === targetedRewordingIdWithDefault}
                      data={record}
                      template={template}
                      candidateCount={
                        classifiedRewordings.candidateVersions.length
                      }
                      historyCount={
                        classifiedRewordings.historicVersions.length
                      }
                      rejectedCount={
                        classifiedRewordings.rejectedVersions.length
                      }
                      canElect={canElect}
                      electingRewording={electingRewording}
                      isNavigatePanelOpened={isNavigatePanelOpened}
                      initEdit={() => enterEdit(record)}
                      toggleNavigatePanel={toggleNavigatePanel}
                      currentUser={currentUser}
                    />
                  ))}
                </div>
              ) : (
                <CoverPlaceholder image={coverImage} ratio={ratio} />
              )}
            </div>
            {shouldDisplayTips && <CoverDropTips />}
          </div>
        )}
      </FileDropzone>
      <div
        className="dz-CoverSection__navigate"
        style={isNavigatePanelOpened ? undefined : { display: 'none' }}
      >
        {versionArray &&
          versionArray.map((record, index) => (
            <div className="dz-CoverSection__thumbnail" key={record.id}>
              <CoverThumbnail
                isSelected={record.id === targetedRewordingId}
                data={record}
                template={template}
                ratio={ratio}
                onClick={() => changeTargetedRewording(record.id, index)}
              />
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="dz-CoverSection">
      {preview}
      {blockState.isEditModeEnabled && (
        <CoverCropper
          previewBox={blockState.box}
          data={getTemplateCropInfo(blockState.activeRewording, template)}
          sourceImage={blockState.sourceImage}
          onCancel={props.exitBlockEdit}
          onConfirm={submitEditContent}
        />
      )}
    </div>
  );
}

CoverBlockRender.propTypes = {
  blockState: PropTypes.object,
  template: PropTypes.string,
  coverImage: PropTypes.string,
  bundleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  nodeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  blockId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  structure: PropTypes.string,
  rewordings: PropTypes.array,
  currentUser: PropTypes.object,
  userCapabilities: PropTypes.object,
  classifiedRewordings: PropTypes.shape({
    currentVersion: PropTypes.object,
    candidateVersions: PropTypes.array,
    historicVersions: PropTypes.array,
    rejectedVersions: PropTypes.array,
  }),
  exitBlockEdit: PropTypes.func,
  initBlockEdit: PropTypes.func,
  updateBlockState: PropTypes.func,
  postCoverRewording: PropTypes.func,

  intl: PropTypes.object,
};

export default injectIntl(CoverBlockRender, { forwardRef: true });
