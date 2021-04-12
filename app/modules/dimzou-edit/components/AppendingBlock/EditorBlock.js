import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import ActionButton from '@/components/ActionButton';
import DimzouEditor, { getHTML, convertToRaw } from '../DimzouEditor';
import {
  commitBlock,
  submitBlock,
  removeAppendBlock,
  updateAppendBlock,
} from '../../actions';
import { appendingBlockKey } from '../../utils/cache';
import { TAILING_PIVOT } from '../../constants';

function EditorBlock(props) {
  const {
    editorState,
    submitting,
    placeholder,
    currentUser,
    editorMode,
    style,
    isTailing,
    lastBlockId,
    bundleId,
    nodeId,
    pivotId,
  } = props;
  const dispatch = useDispatch();
  const hasText = editorState.getCurrentContent().hasText();

  const handleConfirm = (e) => {
    e.preventDefault();
    // is empty.
    if (!editorState.getCurrentContent().hasText()) {
      dispatch(
        removeAppendBlock({
          bundleId,
          nodeId,
          pivotId,
        }),
      );
      return;
    }
    const contentState = editorState.getCurrentContent();
    const htmlContent = getHTML(contentState);
    const content = convertToRaw(contentState);
    const data = {
      bundleId,
      nodeId,
      pivotId: isTailing ? lastBlockId : pivotId,
      isTailing,
      content,
      htmlContent,
      cacheKey: appendingBlockKey({
        nodeId,
        pivotId,
      }),
    };
    if (props.userCapabilities.canElect) {
      dispatch(commitBlock(data));
    } else {
      dispatch(submitBlock(data));
    }
  };

  return (
    <div
      className={classNames(
        'dz-BlockSection',
        'dz-BlockSection_content',
        'dz-BlockSection_appending',
      )}
      style={style}
    >
      <div className="dz-BlockSection__leading">
        <div className="dz-BlockSection__paraNum">{props.sort}</div>
      </div>
      <DimzouEditor
        className="dz-Typo dz-ContentEditRegion"
        placeholder={placeholder}
        editorState={editorState}
        onChange={(editorState) => {
          dispatch(
            updateAppendBlock({
              bundleId,
              nodeId,
              pivotId,
              editorState,
            }),
          );
        }}
        mode={editorMode}
        onBlur={() => {
          if (
            props.pivotId !== TAILING_PIVOT &&
            !props.editorState.getCurrentContent().hasText()
          ) {
            dispatch(
              removeAppendBlock({
                bundleId,
                nodeId,
                pivotId,
              }),
            );
          }
        }}
        currentUser={currentUser}
      />
      <div className="dz-BlockSection__footer">
        <div className="dz-BlockSectionFooter">
          <div className="dz-BlockSectionFooter__left" />
          <div className="dz-BlockSectionFooter__right">
            <ActionButton
              type="no"
              size="md"
              disabled={!hasText || submitting}
              className={classNames('dz-BlockSectionFooter__btn', {
                'is-invisible': !hasText,
              })}
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  removeAppendBlock({
                    bundleId,
                    nodeId,
                    pivotId,
                  }),
                );
              }}
            />
            <ActionButton
              type="ok"
              size="md"
              disabled={!hasText || submitting}
              className={classNames('dz-BlockSectionFooter__btn', {
                'is-invisible': !hasText,
              })}
              onClick={handleConfirm}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

EditorBlock.propTypes = {
  bundleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  nodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pivotId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lastBlockId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  userCapabilities: PropTypes.object,
  submitting: PropTypes.bool,
  editorMode: PropTypes.string,
  editorState: PropTypes.object,
  isTailing: PropTypes.bool,
  placeholder: PropTypes.node,
  currentUser: PropTypes.object,
  style: PropTypes.object,
  sort: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default EditorBlock;
