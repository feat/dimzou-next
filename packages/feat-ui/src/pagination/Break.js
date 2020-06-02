import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

export default function Break(props) {
  return (
    <li className={`${props.prefixCls}__break`}>
      {props.breakLabel}
    </li>
  );
}

Break.propTypes = {
  prefixCls: PropTypes.string.isRequired,
  breakLabel: PropTypes.node.isRequired,
};
