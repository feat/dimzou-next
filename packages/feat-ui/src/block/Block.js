import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { namespace as defaultNamespace } from "../config";

const Block = React.forwardRef((props, ref) => {
  const {
    namespace,
    className,
    subTitle,
    subHeader,
    secondary,
    title,
    children,
    noPadding,
    ...restProps
  } = props;
  const blockName = `${namespace}-Block`;
  return (
    <div
      {...restProps}
      className={classNames(className, {
        [blockName]: true,
        [`${blockName}_primary`]: !secondary,
        [`${blockName}_secondary`]: secondary,
      })}
      ref={ref}
    >
      <div
        className={classNames({
          [`${blockName}__header`]: true,
          [`${blockName}__header_primary`]: !secondary,
          [`${blockName}__header_secondary`]: secondary,
          [`${blockName}__header_noPadding`]: noPadding,
        })}
      >
        <div
          className={classNames({
            [`${blockName}__title`]: true,
            [`${blockName}__title_primary`]: !secondary,
            [`${blockName}__title_secondary`]: secondary,
          })}
        >
          {title}
          {subTitle && (
            <span className={`${blockName}__subTitle`}>{subTitle}</span>
          )}
        </div>
        {subHeader && (
          <div className={`${blockName}__subHeader`}>{subHeader}</div>
        )}
      </div>
      <div
        className={classNames(`${blockName}__content`, props.contentClassname, {
          [`${blockName}__content_noPadding`]: noPadding,
        })}
      >
        {children}
      </div>
    </div>
  );
});

Block.propTypes = {
  title: PropTypes.node.isRequired,
  subHeader: PropTypes.node,
  subTitle: PropTypes.node,
  children: PropTypes.node.isRequired,
  secondary: PropTypes.bool,
  namespace: PropTypes.string,
  noPadding: PropTypes.bool,
  contentClassname: PropTypes.string,
  className: PropTypes.string,
};

Block.defaultProps = {
  namespace: defaultNamespace,
};

export default Block;