import React from "react";
import Checkbox from "@feat/feat-ui/lib/checkbox";

/** checkbox 的基本使用 */
export default class Example extends React.Component {
  state = { checked: false };

  handleChange = (e) => {
    const { checked } = e.target;
    this.setState({ checked });
  };

  render() {
    return (
      <div>
        <Checkbox checked={this.state.checked} onChange={this.handleChange} />
      </div>
    );
  }
}
