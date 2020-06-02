import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

class AvatarStampBase extends React.PureComponent {
  getSeparator(blockName, key) {
    const className = `${blockName}__separator`;
    return React.cloneElement(this.props.separator, {
      className: classNames(this.props.separator.className, className),
      key,
    });
  }

  renderMetaArray(blockName, metaArray) {
    const item = [];
    let shouldInsertSeparator = false;
    metaArray.forEach && metaArray.forEach((key, index) => {
      const meta = this.props[key];
      if (!meta) {
        return;
      }
      if (shouldInsertSeparator) {
        item.push(this.getSeparator(blockName, index));
      }
      shouldInsertSeparator = true;
      if (typeof meta === "string") {
        item.push(<span className={`${blockName}__${key}`} key={key}>{this.props[key]}</span>);
        return;
      }
      item.push(React.cloneElement(meta, { key }));
    });
    return item;
  }

  render() {
    return (
      <div>Should Be Over Written.</div>
    );
  }
}

AvatarStampBase.propTypes = {
  separator: PropTypes.node,
};

AvatarStampBase.defaultProps = {
  separator: (<span>·</span>),
};

export default AvatarStampBase;
