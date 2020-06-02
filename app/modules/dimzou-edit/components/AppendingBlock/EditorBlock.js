import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import IconButton from '@feat/feat-ui/lib/button/IconButton';
import DimzouEditor, { getHTML, convertToRaw } from '../DimzouEditor';
import { 
  commitBlock, 
  submitBlock,
  removeAppendBlock, 
  updateAppendBlock,
} from '../../actions';
import { getNodeCache, appendingBlockKey } from '../../utils/cache'
import { MeasureContext } from '../../context'

class EditorBlock extends React.PureComponent {
  componentDidUpdate(prevProps) {
    if (
      this.shouldTryToRemove &&
      !this.props.editorState.getCurrentContent().hasText()
    ) {
      this.removeBlock();
    }
    this.shouldTryToRemove = false;
    if (this.props.editorState !== prevProps.editorState && this.context) {
      this.context.measure();
    }
  }

  removeBlock = () => {
    const cache = getNodeCache(this.props.nodeId);
    cache.set(appendingBlockKey({
      nodeId: this.props.nodeId,
      pivotId: this.props.pivotId,
    }), '');
    this.props.dispatch(
      removeAppendBlock({
        bundleId: this.props.bundleId,
        nodeId: this.props.nodeId,
        pivotId: this.props.pivotId,
      }),
    );
  };

  handleConfirm = (e) => {
    e.preventDefault();
    const {
      editorState,
      bundleId,
      nodeId,
      pivotId,
      isTailing,
      lastBlockId,
    } = this.props;

    // is empty.
    if (!editorState.getCurrentContent().hasText()) {
      this.removeBlock();
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
    if (this.props.userCapabilities.canElect) {
      this.props.dispatch(commitBlock(data));
    } else {
      this.props.dispatch(submitBlock(data));
    }
  };

  handleCancel = (e) => {
    e.preventDefault();
    this.removeBlock();
  };

  handleChange = (editorState) => {
    this.props.dispatch(
      updateAppendBlock({
        bundleId: this.props.bundleId,
        nodeId: this.props.nodeId,
        pivotId: this.props.pivotId,
        editorState,
      }),
    );
    const cache = getNodeCache(this.props.nodeId);
    const contentState = editorState.getCurrentContent();
    cache.set(appendingBlockKey({
      nodeId: this.props.nodeId,
      pivotId: this.props.pivotId,
    }), contentState.hasText() ? getHTML(contentState) : '');
  };

  handleBlur = () => {
    this.shouldTryToRemove = true;
  };

  render() {
    const { editorState, submitting, placeholder, currentUser, style } = this.props;
    const hasText = editorState.getCurrentContent().hasText();
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
          onChange={this.handleChange}
          mode={this.props.editorMode}
          onBlur={this.handleBlur}
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
                onClick={this.handleCancel}
              />
              <IconButton
                svgIcon="ok-btn"
                size="md"
                disabled={!hasText || submitting}
                className={classNames('dz-BlockSectionFooter__btn',{
                  'is-invisible': !hasText,
                })}
                onClick={this.handleConfirm}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EditorBlock.contextType = MeasureContext;

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
  dispatch: PropTypes.func,
  placeholder: PropTypes.node,
  currentUser: PropTypes.object,
  style: PropTypes.object,
};

export default EditorBlock;
