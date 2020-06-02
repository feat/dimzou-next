import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import { namespace as defaultNamespace } from "../config";
import throttle from "../util/throttle";
import { scrollTo, getOffsetTop } from "../util/getScrollTop";

export default class Anchor extends React.Component {
  static propTypes = {
    offset: PropTypes.number.isRequired,
    namespace: PropTypes.string,
    blockName: PropTypes.string,
  };

  static defaultProps = {
    offset: 0,
    namespace: defaultNamespace,
    blockName: "Anchor",
  };

  constructor(props) {
    super(props);
    this.links = [];
    this.scrolling = false;
    this.state = {
      activeAnchor: null,
    };
    this.prefixClass = `${props.namespace}-${props.blockName}`;

    this.throttleScroll = throttle(this.handleScroll.bind(this), 30);
  }

  componentDidMount() {
    this.throttleScroll();
    document.addEventListener("scroll", this.throttleScroll);
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.throttleScroll);
  }


  getCurrentAnchor = (offsetTop = this.props.offset, bounds = 5) => {
    const activeAnchor = "";
    if (typeof document === "undefined") {
      return activeAnchor;
    }
    const linksPositions = (this.links.map((section) => {
      const target = document.getElementById(section.substring(1));
      if (target && getOffsetTop(target) < offsetTop + bounds) {
        const top = getOffsetTop(target);
        if (top <= offsetTop + bounds) {
          return {
            section,
            top,
            // bottom: top + target.clientHeight
          };
        }
      }
      return null;
    }).filter((section) => section !== null));
    if (linksPositions.length) {
      const maxSection = linksPositions.reduce((prev, curr) => curr.top > prev.top
        ? curr
        : prev);
      return maxSection.section;
    }
    return "";
  }

  handleScroll() {
    this.setState({ activeAnchor: this.getCurrentAnchor() });
  }

  scrollCallback = () => {
    this.scrolling = false;
  }

  scrollTo = (href) => {
    if (this.scrolling) return;
    this.scrolling = true;
    scrollTo(href, this.props.offset, window, this.scrollCallback);
  }

  renderChild(child) {
    const { href } = child.props;
    this.links.push(href);
    return React.cloneElement(child, {
      onClick: this.scrollTo,
      activeAnchor: this.state.activeAnchor,
      prefixClass: this.prefixClass,
    });
  }

  render() {
    const { children, className, blockName, namespace, ...rest } = this.props;
    this.links = [];
    return (
      <section className={cx(this.prefixClass, className)} {...rest}>
        {React.Children.map(children, (child) => this.renderChild(child))}
      </section>
    );
  }
}
