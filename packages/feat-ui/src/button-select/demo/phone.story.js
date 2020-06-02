import React from "react";
import Button from "@feat/feat-ui/lib/button";
import Select from "@feat/feat-ui/lib/button-select";
import countryOptions from "./countryOptions";
import flag from "./flag.svg";

/** Select Custom renderOption Example */

class Example extends React.Component {
  state = {
    value: undefined,
  };

  render() {
    return (
      <div style={{ height: 500, display: "flex" }}>
        <Select
          options={countryOptions}
          value={this.state.value}
          onChange={(value, option) => {
            this.setState({ value });
          }}
          showFilter
          placeholder="Select A Value"
          renderTrigger={(value, option, props) => (
            <Button>{(option && option.name) || props.placeholder}</Button>
          )}
          valueExtractor={(option) => option.id}
          renderOption={(option, meta) => (
            <div
              className="ft-ButtonSelectOption"
              style={{
                height: 44,
                display: "flex",
                alignItems: "center",
                background:
                  meta.isSelected || meta.isFocused
                    ? "rgba(233, 233, 129, .3)"
                    : undefined,
              }}
            >
              <img
                style={{ width: 24, height: "auto", marginRight: 12 }}
                src={flag}
              />
              <span>
                {option.name}({option.calling_code})
              </span>
            </div>
          )}
          filterOption={(option, filter) => {
            if (!filter) {
              return true;
            }
            return (
              option.name.indexOf(filter) > -1 ||
              String(option.calling_code).indexOf(filter) > -1
            );
          }}
        />
      </div>
    );
  }
}

export default Example;
