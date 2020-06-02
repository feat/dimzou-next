import React from "react";
import { action } from "@storybook/addon-actions";
import Button from "@feat/feat-ui/lib/button";
import Select from "@feat/feat-ui/lib/button-select";

const createOptions = (count) => {
  const options = [];
  for (let i = 0; i < count; i++) {
    options.push({
      value: i,
      label: `item_${i}`,
    });
  }
  return options;
};

const options = createOptions(20);

/** 气泡卡片的用法。 */

class Example extends React.Component {
  state = {
    value: 0,
  };

  render() {
    return (
      <div style={{ width: 400, margin: "0 auto" }}>
        <Select
          options={options}
          value={this.state.value}
          onChange={(value, option) => {
            action("onChange")(value, option);
            this.setState({ value });
          }}
          placeholder="Select A Value"
          dropdownContainerStyle={{ maxWidth: "300px" }}
          renderTrigger={(value, option, props) => (
            <Button>{(option && option.label) || props.placeholder}</Button>
          )}
          filterOption={(option, filter) => option.label.indexOf(filter) > -1}
          onOpen={(...args) => {
            console.log("onOpen", args);
          }}
          onClose={(...args) => {
            console.log("onClose", args);
          }}
        />
      </div>
    );
  }
}

export default Example;
