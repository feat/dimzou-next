import React, { Component } from "react";
import PropTypes from "prop-types";

import throttle from "../util/throttle";
import lineTruncate from "./lib/lineTruncate";

class LineTruncate extends Component {
  constructor(props) {
    super(props);
    this.truncate = throttle(this.truncate.bind(this), 100);
  }

  componentDidMount() {
    setTimeout(this.truncate, 0);
    window.addEventListener("resize", this.truncate);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.truncate);
  }

  truncate() {
    const { lines, ellipsis, children } = this.props;
    if (!this.dom) {
      return;
    }
    this.dom.innerText = children;
    lineTruncate(this.dom, {
      lines,
      ellipsis,
    });
  }

  render() {
    const { children } = this.props;
    return (
      <span ref={(n) => { this.dom = n; }}>
        {children}
      </span>
    );
  }
}

LineTruncate.propTypes = {
  lines: PropTypes.number,
  ellipsis: PropTypes.bool,
  children: PropTypes.string,
};

LineTruncate.displayName = "LineTruncate";

export default LineTruncate;
