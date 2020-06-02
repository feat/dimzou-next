import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RichUtils, EditorState } from '@feat/draft-js';

import Button from './Button';
import icons from './defaultButtons';
import handleToggleBlockType from '../../handlers/handleToggleBlock';
import handleToggleInlineStyle from '../../handlers/handleToggleInlineStyle';

function isActive(icon, blockType, currentStyle) {
  if (icon.type === 'block') {
    return blockType === icon.value;
  }
  if (icon.type === 'inline') {
    return currentStyle.has(icon.value);
  }
}

class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.toggleBlockType = this.toggleBlockType.bind(this);
    this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
  }
  getHandler(icon) {
    if (icon.onClick) {
      if (!this[`icon_${icon.value}_handleClick`]) {
        this[`icon_${icon.value}`] = value => icon.onClick.call(null, this.props.editorState, this.props.onChange, value);
      }
      return this[`icon_${icon.value}`];
    }
    if (icon.type === 'block') {
      return this.toggleBlockType;
    }
    if (icon.type === 'inline') {
      return this.toggleInlineStyle;
    }
  }
  toggleBlockType(blockType) {
    const { editorState, onChange, beforeToggleBlockType } = this.props;
    if (beforeToggleBlockType) {
      const canToggle = beforeToggleBlockType(editorState, blockType);
      if (!canToggle) {
        return;
      }
    }
    this.props.handleToggleBlockType(editorState, onChange, blockType);
  }
  toggleInlineStyle(inlineStyle) {
    const { editorState, onChange } = this.props;
    this.props.handleToggleInlineStyle(editorState, onChange, inlineStyle);
  }
  render() {
    const { icons, editorState } = this.props;
    const blockType = RichUtils.getCurrentBlockType(editorState);
    const currentStyle = editorState.getCurrentInlineStyle();
    return (
      <div className="FeatEditorToolbar">
        {icons.map((icon, index) => (
          <Button
            key={icon.value}
            {...icon}
            isActive={isActive(icon, blockType, currentStyle)}
            onClick={this.getHandler(icon)}
          />
        ))}
      </div>
    );
  }
}

Toolbar.propTypes = {
  onChange: PropTypes.func.isRequired,
  editorState: PropTypes.instanceOf(EditorState).isRequired,
  icons: PropTypes.array,
  beforeToggleBlockType: PropTypes.func,
  handleToggleInlineStyle: PropTypes.func,
  handleToggleBlockType: PropTypes.func,
};

Toolbar.defaultProps = {
  icons,
  handleToggleBlockType,
  handleToggleInlineStyle,
};

export default Toolbar;
