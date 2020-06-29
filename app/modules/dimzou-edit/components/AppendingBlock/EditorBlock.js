import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import IconButton from '@feat/feat-ui/lib/button/IconButton';
import DimzouEditor, { getHTML, convertToRaw } from '../DimzouEditor';
import { 
  commitBlock, 
  submitBlock,
  removeAppendBlock, 
  updateAppendBlock,
} from '../../actions';
import { appendingBlockKey } from '../../utils/cache'
import { useMeasure } from '../../context'
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

  useMeasure([editorState]);

  const handleConfirm = (e) => {
    e.preventDefault();
    // is empty.
    if (!editorState.getCurrentContent().hasText()) {
      dispatch(removeAppendBlock({
        bundleId,
        nodeId,
        pivotId,
      }))
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
  }

  return (
    <div
      className={classNames(
        'dz-BlockSection',
        'dz-BlockSection_content',
        'dz-BlockSection_appending',
      )}
      style={style}
    >
      <div className="dz-BlockSection__paraNum"></div>
      <DimzouEditor
        className="typo-Article"
        placeholder={placeholder}
        editorState={editorState}
        onChange={(editorState) => {
          dispatch(updateAppendBlock({
            bundleId,
            nodeId,
            pivotId,
            editorState,
          }));
        }}
        mode={editorMode}
        onBlur={() => {
          if (props.pivotId !== TAILING_PIVOT && !props.editorState.getCurrentContent().hasText()) {
            dispatch(removeAppendBlock({
              bundleId,
              nodeId,
              pivotId,
            }))
          }
        }}
        currentUser={currentUser}
      />
      <div className="dz-BlockSection__footer">
        <div className="dz-BlockSectionFooter">
          <div className="dz-BlockSectionFooter__left" />
          <div className="dz-BlockSectionFooter__right">
            <IconButton
              svgIcon="no-btn"
              size="md"
              disabled={!hasText || submitting}
              className={classNames('dz-BlockSectionFooter__btn', {
                'is-invisible': !hasText,
              })}
              onClick={(e) => {
                e.preventDefault();
                dispatch(removeAppendBlock({
                  bundleId,
                  nodeId,
                  pivotId,
                }),)
              }}
            />
            <IconButton
              svgIcon="ok-btn"
              size="md"
              disabled={!hasText || submitting}
              className={classNames('dz-BlockSectionFooter__btn',{
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
};

export default EditorBlock;
