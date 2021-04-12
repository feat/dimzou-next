/**
 * 响应内容编辑区域的图片上传，实现插入图片功能
 * 需要配合 React-virtualized List 使用
 * 1. 提供服务方法，根据当前 List index 获得容器样式
 * 2. 当内容未加载完成时，不应该响应拖放动作
 * 3. 允许通过参数设置“LineItem”元素
 * 4. 可以设置为禁用，当正文内容不允许插入段落时，不需要对拖放动作进行响应
 *
 */

import { createRef, PureComponent } from 'react';
import PropTypes from 'prop-types';
import composeRefs from '@seznam/compose-react-refs';
import message from '@feat/feat-ui/lib/message';
import get from 'lodash/get';
import { DropTarget } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';

const TRANSITION_DURATION = 100;
const DROP_REGION_HEIGHT = 40;

class ContentDropzone extends PureComponent {
  state = {
    pivotIndex: undefined,
  };

  domRef = createRef();

  pointerY = createRef();

  componentDidMount() {
    if (this.domRef.current) {
      this.domRef.current.addEventListener('dragover', this.updatePivotIndex);
    }
  }

  componentWillUnmount() {
    if (this.domRef.current) {
      this.domRef.current.removeEventListener(
        'dragover',
        this.updatePivotIndex,
      );
    }
  }

  getPivotIndex = () => {
    if (!this.props.isActive) {
      return undefined;
    }
    return this.state.pivotIndex;
  };

  updatePivotIndex = (e) => {
    if (!this.props.isActive) {
      return;
    }
    const { clientY } = e;
    const { pointerY, domRef } = this;
    // 先判断 clientY 是否变化，来减少 pivotIndex 的判断
    if (clientY !== pointerY.current) {
      pointerY.current = clientY;
      const items = domRef.current.querySelectorAll(this.props.itemSelector);
      let blockIndex;
      for (let i = 0; i < items.length; i += 1) {
        const block = items[i];
        if (!block) {
          continue;
        }
        const box = block.getBoundingClientRect();
        const { top, height } = box;
        // logging.debug(top, height, clientY)
        if (top + height / 2 > clientY) {
          blockIndex = i - 1;
          break;
        }
        if (top + height > clientY) {
          blockIndex = i;
          break;
        }
      }

      blockIndex =
        blockIndex !== undefined && this.props.isValidPivot(blockIndex)
          ? blockIndex
          : undefined;
      // TODO: hintOffset
      this.setState({
        pivotIndex: blockIndex,
      });
      // logging.debug(blockIndex);
    }
  };

  getOffsetStyle = (index) => {
    if (!this.props.isActive) {
      return {};
    }
    const { pivotIndex } = this.state;
    if (pivotIndex !== undefined && index > pivotIndex) {
      return {
        transition: `transform ${TRANSITION_DURATION}ms ease`,
        transform: `translate3d(0px, ${DROP_REGION_HEIGHT}px, 0px)`,
      };
    }
    return {
      transition: `transform ${TRANSITION_DURATION}ms ease`,
    };
  };

  getHintOffset() {
    const { pivotIndex } = this.state;
    if (pivotIndex === -1) {
      return 0;
    }
    const block =
      this.domRef.current &&
      this.domRef.current.querySelectorAll(this.props.itemSelector)[pivotIndex];
    if (!block) {
      return 0;
    }
    return block.offsetTop + block.clientHeight;
  }

  render() {
    return this.props.children({
      domRef: composeRefs(this.domRef, this.props.connectDropTarget),
      active: this.props.isActive && this.state.pivotIndex !== undefined,
      getOffsetStyle: this.getOffsetStyle,
      hintOffset: this.getHintOffset(),
    });
  }
}

ContentDropzone.propTypes = {
  // dnd collect
  isActive: PropTypes.bool,
  connectDropTarget: PropTypes.func,
  // render
  children: PropTypes.func,
  itemSelector: PropTypes.string.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  fileTypeNotSupportedHint: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  onDrop: PropTypes.func.isRequired,
  isValidPivot: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  disabled: PropTypes.bool,
};

ContentDropzone.defaultProps = {
  fileTypeNotSupportedHint: 'File type not supported.',
};

const fileTarget = {
  canDrop(props) {
    if (props.disabled) {
      return false;
    }
    return true;
  },
  drop(props, monitor, component) {
    const item = monitor.getItem();
    const file = get(item, 'files.0');
    const pivotIndex = component.getPivotIndex();
    if (!file || pivotIndex === undefined) {
      return;
    }
    if (/^image\/.*/.test(file.type)) {
      props.onDrop({
        file,
        pivotIndex,
      });
    } else {
      message.error(props.fileTypeNotSupportedHint);
      logging.warn(`DIMZOU_UPLOAD_TYPE_RECEIVED: ${file.type}`);
    }
  },
};

const dropCollect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isActive: monitor.isOver({ shallow: true }),
  itemType: monitor.getItemType(),
  initPointerPosition: monitor.getClientOffset(),
});

export default DropTarget(NativeTypes.FILE, fileTarget, dropCollect)(
  ContentDropzone,
);
