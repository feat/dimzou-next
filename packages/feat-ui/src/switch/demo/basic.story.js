import React from "react";

import Switch from "@feat/feat-ui/lib/switch";

/** switch */
export default class Example extends React.Component {
  state = {
    isOpen: false,
  }

  handleChange = (isOpen) => {
    this.setState({ isOpen });
    console.log(isOpen);
  }

  render() {
    return (
      <Switch
        onChange={this.handleChange}
        isOpen={this.state.isOpen}
      />
    );
  }
}
