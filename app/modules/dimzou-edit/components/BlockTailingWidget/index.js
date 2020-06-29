import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend';
import classNames from 'classnames';
import { compose } from 'redux';

import { formatMessage } from '@/services/intl';

import message from '@feat/feat-ui/lib/message';
import Button from '@feat/feat-ui/lib/button/Button';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import { 
  createAppendBlock,
  updateBlockSort,
  submitMediaBlock,
  commitMediaBlock,
} from '../../actions';

// import { constructAppendParaId } from '../../utils/blocks';
import { createEmptyWithFocus, createFromHTMLWithFocus } from '../DimzouEditor';
import intlMessages from '../../messages';
import { getNodeCache, appendingBlockKey } from '../../utils/cache';
import { DRAGGABLE_TYPE_BLOCK, BEGINNING_PIVOT } from '../../constants';

import './style.scss';

class TailingWidget extends Component {
  handleClick = (e) => {
    e.preventDefault();
    // TODO: add async check for pending block checking...
    const cache = getNodeCache(this.props.nodeId);
    const appendingCache = cache.get(appendingBlockKey({
      nodeId: this.props.nodeId,
      pivotId: this.props.blockId,
    }));
    const editorState = appendingCache && appendingCache.html ? createFromHTMLWithFocus(appendingCache.html) : createEmptyWithFocus();

    this.props.createAppendBlock({
      type: 'editor',
      bundleId: this.props.bundleId,
      nodeId: this.props.nodeId,
      pivotId: this.props.blockId,
      isTailing: false,
      editorState,
      editorMode: 'create',
    });
  };

  render() {
    const { connectDropTarget, isOver, canDrop, canInsert } = this.props;
    return connectDropTarget(
      <div
        className={classNames("dz-ParaTailing", {
          'is-over': isOver && canDrop,
        })}>
        {canInsert && (
          <Button
            block
            htmlType="button"
            type="merge"
            className={classNames('dz-ParaTailing__hint')}
            onClick={this.handleClick}
          >
            <TranslatableMessage message={intlMessages.insertHint} />
          </Button>
        )}
       
        <div className="dz-ParaTailing__dropHint"></div>
      </div>
    );
  }
}

TailingWidget.propTypes = {
  createAppendBlock: PropTypes.func,
  connectDropTarget: PropTypes.func,
  isOver: PropTypes.bool,
  canDrop: PropTypes.bool,
  canInsert: PropTypes.bool,
  bundleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  nodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  blockId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

TailingWidget.defaultProps = {
  canInsert: true,
}


const withConnect = connect(null, { 
  createAppendBlock,
  updateBlockSort,
  submitMediaBlock,
  commitMediaBlock,
});

const withDropTarget = DropTarget(
  [
    DRAGGABLE_TYPE_BLOCK,
    NativeTypes.FILE,
  ],
  {
    canDrop: (props, monitor) => {
      if (props.disabled) {
        return false;
      }
      const data = monitor.getItem();
      if (data.type === DRAGGABLE_TYPE_BLOCK && (
        !props.userCapabilities.isOwner ||
        data.payload.sort === props.sort || 
        data.payload.sort === props.sort + 1
      )) {
        return false;
      }
      return true;
    },
    drop(props, monitor) {
      // may insert appending block or create append media block;
      const data = monitor.getItem();
      if (data.type === DRAGGABLE_TYPE_BLOCK) {
        props.updateBlockSort({
          bundleId: props.bundleId,
          nodeId: props.nodeId,
          blockId: data.payload.blockId,
          originSort: data.payload.sort,
          pivotSort: props.sort,
        })
      } else if (data.files && data.files.length) {
        const file = data.files[0];
        if (/^image\/.*/.test(file.type)) {
          const creator = props.userCapabilities.canElect ? props.commitMediaBlock : props.submitMediaBlock;
          // create media block;
          creator({
            bundleId: props.bundleId,
            nodeId: props.nodeId,
            pivotId: props.blockId || BEGINNING_PIVOT,
            file,
          });
        } else {
          message.error(formatMessage(intlMessages.fileTypeNotSupported));
        }
      }
    },
  },
  (collect, monitor) => ({
    connectDropTarget: collect.dropTarget(),
    isOver: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
  })
)

export default compose(withConnect, withDropTarget)(TailingWidget);
