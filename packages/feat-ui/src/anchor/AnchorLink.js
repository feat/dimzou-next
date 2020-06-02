import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// can use tree to have multiple level
class AnchorLink extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    activeAnchor: PropTypes.string,
    prefixClass: PropTypes.string,
  };

  static defaultProps = {
    className: "ft-Anchor__link",
  };

  render() {
    const {
      className,
      href,
      children,
      label,
      prefixClass,
      activeAnchor,
      onClick,
    } = this.props;

    const linkClass = cx([`${prefixClass}__link`], {
      "is-active": activeAnchor === href,
    }, className);
    return (
      <div className={linkClass} onClick={() => { onClick(href); }}>
        { label ? <a className={[`${prefixClass}__linkTitle`]}>{label}</a> : children}
      </div>
    );
  }
}

export default AnchorLink;
