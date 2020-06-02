import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { getScrollTop } from "../util/getScrollTop";

export default class Position extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    children: PropTypes.element.isRequired,
    offsetY: PropTypes.number,
    offsetX: PropTypes.number,
    direction: PropTypes.oneOf(["auto", "vertical", "horizontal"]),
    getTarget: PropTypes.func.isRequired,
  };

  static defaultProps = {
    direction: "auto",
    offsetX: 4,
    offsetY: 4,
  };

  constructor(props) {
    super(props);
    this.state = {
      style: {
        position: "absolute",
        visibility: "hidden",
      },
    };
    this.needFlush = false;
  }

  componentWillReceiveProps() {
    this.needFlush = true;
  }

  componentDidUpdate() {
    if (this.needFlush) {
      this.needFlush = false;
      this.setPosition();
    }
  }

  componentDidMount() {
    this.setPosition();
    document.addEventListener("resize", this.setPosition);
  }

  componentWillUnmount() {
    document.removeEventListener("resize", this.setPosition);
  }

  setPosition() {
    const {
      offsetX,
      offsetY,
      getTarget,
    } = this.props;
      // place Bottom;
    const popContentBox = {
      position: "absolute",
      display: "inline-block",
      zIndex: 1000,
    };
    const target = getTarget();
    if (!target) return;

    const viewportHeight = document.documentElement.clientHeight;
    const viewportWidth = document.documentElement.clientWidth;
    const triggerBox = target.getBoundingClientRect();
    const popBox = this.content.getBoundingClientRect();
    const scrollTop = getScrollTop();


    // default place bottom;
    // then top;
    function setAutoTop() {
      if (triggerBox.bottom + popBox.height < viewportHeight) {
        popContentBox.top = triggerBox.bottom + scrollTop + offsetY;
      } else {
        popContentBox.top = triggerBox.top - popBox.height + scrollTop - offsetY;
      }
      // if (triggerBox.top - popBox.height > 0)
    }

    function setAutoCenter() {
      const triggerBoxCenter = (triggerBox.left + triggerBox.right) / 2;

      if (triggerBox.left > viewportWidth / 2) {
        popContentBox.right = Math.max(offsetX, viewportWidth - (triggerBoxCenter + popBox.width / 2));
      } else {
        popContentBox.left = Math.max(offsetX, triggerBoxCenter - popBox.width / 2);
      }
    }

    function setHorizontal() {
      popContentBox.top = triggerBox.top + offsetY + scrollTop;
      if (triggerBox.right + popBox.width > window.innerWidth) {
        popContentBox.right = window.innerWidth - triggerBox.left - this.props.offsetX;
      } else {
        popContentBox.left = triggerBox.right + offsetX;
      }
    }

    switch (this.props.direction) {
      case "horizontal":
        setHorizontal();
        break;
      case "auto":
      case "vertical":
      default:
        setAutoTop();
        setAutoCenter();
    }

    this.setState({ style: popContentBox });
  }

  render() {
    const { children, prefixCls } = this.props;
    return (
      <div
        className={prefixCls}
        ref={(n) => { this.content = n; }}
        style={this.state.style}
      >
        {children}
      </div>
    );
  }
}
