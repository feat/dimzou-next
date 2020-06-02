import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { namespace as defaultNamespace } from "../config";

import TabSymbol from "./TabSymbol";

class TabItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      box: null,
    };
  }

  componentDidMount() {
    setTimeout(this.setBoxSize, 300);
    window.addEventListener("resize", this.setBoxSize, false);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.setBoxSize, false);
  }

  setBoxSize = () => {
    const dom = this.dom;
    if (!dom) {
      return;
    }
    const box = dom.getBoundingClientRect();
    this.setState({
      box: {
        width: box.width,
        height: box.height,
      },
    });
  };

  render() {
    const {
      className,
      namespace,
      active,
      bgStyle,
      fill,
      ...restProps
    } = this.props;
    const baseName = `${namespace}-TabItem`;

    return (
      <span
        ref={(node) => {
          this.dom = node;
        }}
        className={classNames(baseName, `${baseName}_feat`, className, {
          "is-active": active,
        })}
        {...restProps}
        onClick={this.props.onClick}
      >
        <span className={`${baseName}__label`}>{this.props.children}</span>
        {this.state.box && (
          <TabSymbol
            className={`${baseName}__bg`}
            style={bgStyle}
            active={active}
            {...this.state.box}
          />
        )}
      </span>
    );
  }
}

TabItem.propTypes = {
  namespace: PropTypes.string,
};

TabItem.defaultProps = {
  namespace: defaultNamespace,
};

export default TabItem;
