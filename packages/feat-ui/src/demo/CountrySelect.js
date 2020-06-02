import React from "react";
import Button from "@feat/feat-ui/lib/button";
import Select from "@feat/feat-ui/lib/button-select";
import flag from "../button-select/demo/flag.svg";

class CountrySelect extends React.Component {
  renderTirgger = (value, option, props) => {
    const placeholder = value ? "Invalid calling code" : props.placeholder;
    return (
      <Button size="md" block className="t-left">
        {option && (
          <img
            style={{ width: 24, height: "auto", marginRight: 12 }}
            src={flag}
          />
        )}
        <span>{(option && option.name) || placeholder}</span>
      </Button>
    );
  };

  render() {
    return (
      <Select
        options={this.props.options}
        value={this.props.value}
        onChange={this.props.onChange}
        onOpen={this.props.onOpen}
        onClose={this.props.onClose}
        showFilter
        placeholder="Select A Value"
        renderTrigger={this.renderTirgger}
        valueExtractor={(option) => String(option.calling_code)}
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
    );
  }
}

export default CountrySelect;
