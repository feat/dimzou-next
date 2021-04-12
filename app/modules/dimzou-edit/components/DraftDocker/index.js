import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDraggable } from '@/services/dnd/hooks';
import ButtonBase from '@feat/feat-ui/lib/button/ButtonBase';
import Tooltip from '@feat/feat-ui/lib/tooltip';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import DimzouEditorToolbar from '../DimzouEditorToolbar';
import TemplateSwitchButton from '../TemplateSwitchButton';
import intlMessages, { menu as menuMessages } from '../../messages';

import Icon from '../Icon';
import './style.scss';

function DraftDocker(props) {
  const [isDragging, position, drag] = useDraggable({
    initialPosition: {
      right: 28,
      bottom: 40,
    },
    handleUpdate: (prev, delta) => ({
      right: prev.right - delta.x,
      bottom: prev.bottom - delta.y,
    }),
    cacheKey: 'dimzou-docker',
  });

  const actionButtons = [
    <TemplateSwitchButton
      className="dz-DockerButton"
      key="template"
      disabled={!props.canChangeTemplate}
      initialValue={props.initialTemplate}
      onChange={props.changeTemplate}
    />,
    // <div className="dz-DockerSeparator" key="template-s" />,
    <Tooltip
      title={<TranslatableMessage message={intlMessages.releaseLabel} />}
      key="release"
      placement="top"
    >
      <ButtonBase
        className={classNames('dz-DockerButton', {
          'is-active': props.isReleaseActive,
        })}
        onClick={props.initRelease}
        disabled={!props.canRelease}
      >
        <Icon name="release" />
      </ButtonBase>
    </Tooltip>,
    // <div className="dz-DockerSeparator" key="release-s" />,
    <Tooltip
      title={<TranslatableMessage message={menuMessages.createPage} />}
      placement="top"
      key="new-chapter"
    >
      <ButtonBase
        className={classNames('dz-DockerButton', {
          'is-active': props.isPageCreateActive,
        })}
        onClick={props.onPageCreateButtonClick}
      >
        <Icon name="page" />
      </ButtonBase>
    </Tooltip>,
    <Tooltip
      title={<TranslatableMessage message={menuMessages.createCover} />}
      placement="top"
      key="new-cover"
    >
      <ButtonBase
        className={classNames('dz-DockerButton', {
          'is-active': props.isCoverCreateActive,
        })}
        onClick={props.onCoverCreateButtonClick}
      >
        <Icon name="book" />
      </ButtonBase>
    </Tooltip>,
    <Tooltip
      title={<TranslatableMessage message={menuMessages.createCopy} />}
      placement="top"
      key="new-copy"
    >
      <ButtonBase
        className={classNames('dz-DockerButton')}
        disabled={!props.canCopy}
        onClick={props.initCopyCreate}
      >
        <Icon name="copy" />
      </ButtonBase>
    </Tooltip>,
  ];

  return (
    <div
      ref={drag}
      className={classNames('dz-EditDockerWrap', props.className, {
        'is-dragging': isDragging,
      })}
      style={position}
    >
      <div className="dz-EditDocker">
        <DimzouEditorToolbar
          className="dz-EditDocker__section"
          structure={props.blockStructure}
          editorState={props.editorState}
          mode={props.editorMode}
          onChange={props.onEditorChange}
        />
        <div className="dz-EditDocker__section">{actionButtons}</div>
      </div>
    </div>
  );
}

DraftDocker.propTypes = {
  className: PropTypes.string,
  editorState: PropTypes.object,
  editorMode: PropTypes.oneOf(['create', 'update']),
  blockStructure: PropTypes.oneOf(['title', 'summary', 'content']),
  onEditorChange: PropTypes.func,
  // template
  canChangeTemplate: PropTypes.bool,
  initialTemplate: PropTypes.string,
  changeTemplate: PropTypes.func,

  // release
  isReleaseActive: PropTypes.bool,
  canRelease: PropTypes.bool,
  initRelease: PropTypes.func,

  // create page
  isPageCreateActive: PropTypes.bool,
  onPageCreateButtonClick: PropTypes.func,
  // create cover
  isCoverCreateActive: PropTypes.bool,
  onCoverCreateButtonClick: PropTypes.func,

  // copy
  canCopy: PropTypes.bool,
  initCopyCreate: PropTypes.func,
};

export default DraftDocker;
