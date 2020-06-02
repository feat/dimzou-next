import React from "react";
import Checkbox from "@feat/feat-ui/lib/checkbox";

/** checkbox 的组合使用 */
export default class Example extends React.Component {
  state = { checkValues: [] };

  handleChange = (values) => {
    this.setState({ checkValues: values });
  }

  render() {
    return (
      <div>
        <Checkbox.Group
          onChange={this.handleChange}
          value={this.state.checkValues}
        >
          <Checkbox value="apple">apple</Checkbox>
          <Checkbox value="banana">banana</Checkbox>
          <Checkbox value="peach">peach</Checkbox>
        </Checkbox.Group>
      </div>
    );
  }
}
