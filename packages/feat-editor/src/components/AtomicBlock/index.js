import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { EditorState, SelectionState } from '@feat/draft-js';
import { ENTITY_TYPE } from '../../constants';
import ImageUploader from '../ImageUploader';
import Image from '../Image';

export default class AtomicBlock extends React.PureComponent {
  handleClick = (e) => {
    e.preventDefault();
    const { blockProps, block, offsetKey } = this.props;
    const editorState = blockProps.getEditorState();
    const node = document.querySelectorAll(`[data-offset-key="${offsetKey}"]`)[0];
    const selection = window.getSelection();
    const range = document.createRange();
    range.setStart(node, 0);
    range.setEnd(node, 0);
    selection.removeAllRanges();
    selection.addRange(range);
    const newEditorState = EditorState.forceSelection(
      editorState,
      new SelectionState({
        anchorKey: block.getKey(),
        anchorOffset: 0,
        focusKey: block.getKey(),
        focusOffset: 0,
        isBackward: false,
      }),
    );
    blockProps.setEditorState(newEditorState);
  };
  render() {
    const { block, contentState, blockProps, offsetKey, direction } = this.props;
    const entityKey = block.getEntityAt(0);
    if (!entityKey) {
      return <div>EMPTY ATOMIC BLOCK</div>;
    }
    const entity = contentState.getEntity(entityKey);
    const entityType = entity.getType();
    const entityData = entity.getData();
    const { isFocused } = blockProps;

    const cx = classNames({
      'is-focused': isFocused,
    });

    switch (entityType) {
      case ENTITY_TYPE.IMAGE_UPLOADER:
        return (
          <ImageUploader
            className={cx}
            isFocused
            entityKey={entityKey}
            offsetKey={offsetKey}
            contentState={contentState}
            uploadManager={blockProps.uploadManager}
            uploadKey={entityData.key}
            onClick={!isFocused ? this.handleClick : undefined}
          />
        );
      case ENTITY_TYPE.IMAGE:
        return (
          <Image
            className={cx}
            entityKey={entityKey}
            contentState={contentState}
            offsetKey={offsetKey}
            direction={direction}
            onClick={!isFocused ? this.handleClick : undefined}
          />
        );
      default:
        return <div>TODO: {entityType}</div>;
    }
  }
}

AtomicBlock.propTypes = {
  offsetKey: PropTypes.string.isRequired,
  direction: PropTypes.string,
  block: PropTypes.object,
  contentState: PropTypes.object,
  blockProps: PropTypes.shape({
    getEditorState: PropTypes.func,
    setEditorState: PropTypes.func,
    uploadManager: PropTypes.object,
    isFocused: PropTypes.bool,
    setReadOnly: PropTypes.func,
    isReadOnly: PropTypes.func,
  }).isRequired,
};
