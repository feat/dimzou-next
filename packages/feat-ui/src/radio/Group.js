import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import ButtonGroup from "../button/ButtonGroup";


export default function RadioGroup(props) {
  const { onChange, children, value, ...restProps } = props;
  return (
    <ButtonGroup
      {...restProps}
    >
      {React.Children.map(children, (btn) => {
        if (!btn) return null;
        return React.cloneElement(btn, {
          className: classNames({
            "is-selected": value === btn.props.value,
          }),
          onClick: (e) => {
            e.preventDefault();
            onChange(btn.props.value);
          },
        })
      })}
    </ButtonGroup>
  )
}
