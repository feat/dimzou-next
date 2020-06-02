import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import SquareButton from "../button/SquareButton";

export default function Page(props) {
  const pageCls = cx(props.className, { "is-selected": props.selected });
  return (
    <SquareButton
      className={pageCls}
      onClick={props.onClick}
      onKeyPress={props.onClick}
      disabled={props.disabled}
      size={props.size}
    >
      {props.label}
    </SquareButton>
  );
}

Page.propTypes = {
  className: PropTypes.string,
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  size: PropTypes.string,
  label: PropTypes.node.isRequired,
};
