import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import getLineHeight from "../../util/getLineHeight";
import LineTruncate from "../LineTruncate";

export default function(Compo) {
  class Clamp extends Component {
    static propTypes = {
      lines: PropTypes.number.isRequired,
      children: PropTypes.string.isRequired,
      ellipsis: PropTypes.bool,
      style: PropTypes.object,
    };

    constructor(props) {
      super(props);
      this.state = {};
    }

    componentDidMount() {
      const { lines } = this.props;
      const lineHeight = getLineHeight(this.dom);
      const fontSize = parseFloat(
        window.getComputedStyle(this.dom).fontSize,
        10
      );
      const relative = lineHeight / fontSize;
      this.setState({
        clampStyle: {
          maxHeight: `${Math.ceil(lines * relative)}em`,
        },
      });
    }

    renderChildren() {
      const { children, lines, ellipsis } = this.props;
      if (typeof children === "string") {
        return (
          <LineTruncate children={children} lines={lines} ellipsis={ellipsis} />
        );
      }
      return React.Children.map(children, (compo) => {
        if (compo.type && compo.type.displayName === "LineTruncate") {
          return React.cloneElement(compo, {
            lines,
            ellipsis,
          });
        }
        return compo;
      });
    }

    render() {
      const { lines, ellipsis, style, children, ...restProps } = this.props;
      const { clampStyle = {} } = this.state;
      return (
        <Compo
          ref={(c) => {
            this.dom = ReactDOM.findDOMNode(c);
          }}
          style={{ ...style, ...clampStyle }}
          {...restProps}
        >
          {this.state.clampStyle && this.renderChildren()}
        </Compo>
      );
    }
  }
  return Clamp;
}
