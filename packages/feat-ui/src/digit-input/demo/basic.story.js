import React from "react";
import DigitInput from "@feat/feat-ui/lib/digit-input";

/** digitInput 的基本使用 */
export default class Example extends React.Component {
  state = { value: "" };

  handleChange = (value) => {
    this.setState({ value });
  };

  render() {
    return (
      <div>
        <DigitInput
          value={this.state.value}
          onChange={this.handleChange}
          type="text"
          digitCount={6}
        />
      </div>
    );
  }
}
