import React from "react";
import Input from "@feat/feat-ui/lib/float-label-input";

/** 在表单中使用, 横向位置不足时 */
export default class Example extends React.Component {
  state = { value: "" }

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ value });
  }

  render() {
    return (
      <Input
        onChange={this.handleChange}
        value={this.state.value}
        label="name"
      />
    );
  }
}
