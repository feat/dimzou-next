import React from "react";
import Radio from "@feat/feat-ui/lib/radio";
import Button from "@feat/feat-ui/lib/button";

class Example extends React.Component {
  state = {
    value: "A",
  }

  handleChange = (value) => {
    this.setState({ value });
  }

  render() {
    return (
      <Radio.Group
        value={this.state.value}
        onChange={this.handleChange}
      >
        <Button value="A">Option A</Button>
        <Button value="B">Option B</Button>
      </Radio.Group>
    );
  }
}

export default Example;
