import React from "react";

export default class TriggerWrap extends React.Component {
  render() {
    const { children, ...rest } = this.props;
    const newChildren = React.cloneElement(children, { ...rest });
    return newChildren;
  }
}
