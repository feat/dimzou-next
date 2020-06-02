import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import keyCode from "../util/keycode";
import { namespace as defaultNS } from "../config";
import Page from "./Page";
import Break from "./Break";

function noop() {}

export default class Pagination extends React.Component {
  static propTypes = {
    current: PropTypes.number,
    total: PropTypes.number.isRequired,
    pageSize: PropTypes.number,
    marginPagesDisplayed: PropTypes.number,
    onChange: PropTypes.func,
    itemRender: PropTypes.func,
    showQuickJumper: PropTypes.bool,
    displayNum: PropTypes.number,
    previousLabel: PropTypes.node,
    nextLabel: PropTypes.node,
    breakLabel: PropTypes.node,
    namespace: PropTypes.string.isRequired,
    blockName: PropTypes.string.isRequired,
    size: PropTypes.oneOf(["sm", "md", "lg"]),
  };

  static defaultProps = {
    current: 1,
    pageSize: 10,
    marginPagesDisplayed: 1,
    showQuickJumper: false,
    displayNum: 5,
    onChange: noop,
    itemRender: Page,
    previousLabel: "«",
    nextLabel: "»",
    breakLabel: "...",
    namespace: defaultNS,
    blockName: "Pagination",
    size: "sm",
  };

  constructor(props) {
    super(props);
    this.state = {
      current: props.current,
      totalPage: Math.ceil(props.total / props.pageSize),
      quickJumpValue: "",
    };
    this.Cls = `${props.namespace}-${props.blockName}`;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      current: nextProps.current,
      totalPage: Math.ceil(nextProps.total / nextProps.pageSize),
    });
  }

  handlePageChange = (index, e) => {
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    if (index === this.state.current) return;
    this.props.onChange(index);
    this.setState({ current: index });
  };

  handlePrevPage = (e) => {
    const { current } = this.state;
    if (current > 1) {
      this.handlePageChange(current - 1, e);
    }
  };

  handleNextPage = (e) => {
    const { current } = this.state;
    if (current < this.state.totalPage) {
      this.handlePageChange(current + 1, e);
    }
  };

  handleJump = (e) => {
    if (e.keyCode === keyCode.ENTER) {
      const { totalPage, quickJumpValue } = this.state;
      this.handlePageChange(Math.min(totalPage, quickJumpValue), e);
      this.setState({ quickJumpValue: "" });
    }
  };

  handleJumpChange = (e) => {
    const { value } = e.target;
    if (value === "" || parseInt(value, 10)) {
      this.setState({ quickJumpValue: value });
    }
  };

  renderPages() {
    const {
      displayNum,
      marginPagesDisplayed,
      breakLabel,
      namespace,
      blockName,
    } = this.props;
    const { current, totalPage } = this.state;

    let rightCursor = Math.floor(current + displayNum / 2);
    let leftCursor = Math.floor(current - displayNum / 2);
    if (rightCursor <= displayNum) {
      rightCursor = displayNum;
    } else if (leftCursor > totalPage - displayNum) {
      leftCursor = totalPage - displayNum;
    } // 防止左右两边显示不正确

    const itemArr = [];
    let breakValue = null;

    for (let page = 1; page < totalPage + 1; page += 1) {
      if (totalPage <= displayNum) {
        itemArr.push(this.getPageElement(page, itemArr.length + 1));
        continue;
      } // 当总页数小于页码最大显示数时， 直接返回不走下面的判断
      if (
        page <= marginPagesDisplayed ||
        page > totalPage - marginPagesDisplayed
      ) {
        itemArr.push(this.getPageElement(page, itemArr.length + 1));
        continue;
      } // 最左最右两边的页码
      if (page > leftCursor && page <= rightCursor) {
        itemArr.push(this.getPageElement(page, itemArr.length + 1));
        continue;
      } // 当前页两边的页码
      if (breakLabel && itemArr[itemArr.length - 1] !== breakValue) {
        breakValue = (
          <Break
            prefixCls={this.Cls}
            breakLabel={breakLabel}
            key={itemArr.length + 1}
          />
        );
        itemArr.push(breakValue);
      } // 页码断点
    }
    return itemArr;
  }

  getPageElement(page, key) {
    const props = {
      className: `${this.Cls}__page`,
      onClick: this.handlePageChange.bind(null, page),
      label: page,
      key,
      size: this.props.size,
      selected: this.state.current === page,
    };
    return React.createElement(this.props.itemRender, props);
  }

  render() {
    const { current, totalPage, quickJumpValue } = this.state;
    const containerCls = cx(this.Cls, this.props.className);
    const size = this.props.size;
    return (
      <div className={containerCls}>
        {React.createElement(this.props.itemRender, {
          className: cx(`${this.Cls}__prev`, { "is-disabled": current === 1 }),
          onClick: this.handlePrevPage,
          size,
          disabled: current === 1,
          label: this.props.previousLabel,
        })}

        {this.renderPages()}

        {React.createElement(this.props.itemRender, {
          className: cx(`${this.Cls}__next`, { "is-disabled": current === 1 }),
          onClick: this.handleNextPage,
          size,
          disabled: current === totalPage,
          label: this.props.nextLabel,
        })}

        {this.props.showQuickJumper && (
          <span
            className={cx(
              `${this.Cls}__quickJump`,
              `${this.Cls}__quickJump_${size}`
            )}
          >
            <input
              onChange={this.handleJumpChange}
              value={quickJumpValue}
              onKeyDown={this.handleJump}
            />
          </span>
        )}
      </div>
    );
  }
}
