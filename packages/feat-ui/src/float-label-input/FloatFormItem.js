import React, { Component } from "react";
import PropTypes from "prop-types";
import FloatLabelInput from "./FloatLabelInput";

export default function FloatFormItem(props) {
  const { label, labelStyle, labelClassName, ...restProps } = props;
  return (
    <div className="ft-FormItem">
      <FloatLabelInput
        {...restProps}
      />
    </div>
  )
};
