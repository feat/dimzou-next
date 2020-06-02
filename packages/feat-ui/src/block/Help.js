import React, { Component } from "react";
import { namespace as defaultNamespace } from "../config";

export default function BlockHelp(props) {
  const { namespace, className, ...restProps } = props;
  const cls = [`${namespace}-Block__help`];
  className && cls.push(className);
  return (
    <div className={cls.join(" ")} {...restProps}>
      {props.children}
    </div>
  );
}

BlockHelp.defaultProps = {
  namespace: defaultNamespace,
};
