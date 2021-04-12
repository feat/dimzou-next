import React from 'react';
import PropTypes from 'prop-types';
import { RichUtils } from '@feat/draft-js';

import StyleButton from './StyleButton';

function BlockToolbar(props) {
  const blockType =
    props.editorState && RichUtils.getCurrentBlockType(props.editorState);
  return (
    <div className="dz-DockerButtonGroup">
      {props.buttons.map((button) => (
        <StyleButton
          key={button.style}
          {...button}
          disabled={!props.editorState || button.disabled}
          isActive={blockType === button.style}
          onToggle={props.onToggle}
        />
      ))}
    </div>
  );
}

BlockToolbar.propTypes = {
  buttons: PropTypes.array.isRequired,
  editorState: PropTypes.object,
  onToggle: PropTypes.func.isRequired,
};

export default BlockToolbar;
