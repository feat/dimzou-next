import React from "react";
import FlatSelect from "@feat/feat-ui/lib/flat-select";
import Button from "@feat/feat-ui/lib/button";

const selectList = Array.from({ length: 10 }, (item, index) => ({
  label: `day${index}`,
  disabled: Boolean(Math.round(Math.random())),
  value: String(index),
}));

export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: [],
    };
  }

  handleChange = (value) => {
    console.log(value);
    this.setState({ value });
  }

  render() {
    return (
      <div>
        <FlatSelect
          onChange={this.handleChange}
          value={this.state.value}
          gridSpan={4}
          options={selectList}
          multiple
        />
      </div>
    );
  }
}
