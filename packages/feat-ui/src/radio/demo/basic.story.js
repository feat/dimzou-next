import React from "react";
import Radio from "@feat/feat-ui/lib/radio";

class Example extends React.Component {
  state = {
    checked: false,
  }

  handleChange = (e) => {
    console.log(e.target.checked, "onChange");
    this.setState({
      checked: e.target.checked,
    });
  }

  render() {
    return (
      <Radio
        name="demo"
        checked={this.state.checked}
        onChange={this.handleChange}
      />
    );
  }
}

export default Example;
