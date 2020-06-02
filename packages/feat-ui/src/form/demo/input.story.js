import React from "react";
import classNames from "classnames";
import Form from "@feat/feat-ui/lib/form";
import Button from "@feat/feat-ui/lib/button";
import ButtonSelect from "@feat/feat-ui/lib/button-select";

import countryOptions from "./countryOptions";

const countryFilter = (option, filter) => {
  if (!filter) {
    return true;
  }
  const lfilter = filter.toLowerCase();

  return (
    option.name.toLowerCase().indexOf(lfilter) > -1 ||
    String(option.callingCode)
      .toLowerCase()
      .indexOf(lfilter) > -1
  );
};

class Example extends React.Component {
  state = {
    country: "",
    phone: "",
  };

  onCountryChange = (value) => {
    this.phoneInput && this.phoneInput.focus();
    this.setState({
      country: value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log("handle submit", this.state);
  };

  renderCountryOption = (option, meta) => (
    <Button
      block
      type="merge"
      size="md"
      className={classNames({
        "is-focused": meta.isFocused,
        "is-selected": meta.isSelected,
      })}
      style={{ textAlign: "left" }}
    >
      <span>
        {option.name} ( {option.callingCode} )
      </span>
    </Button>
  );

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item label="Phone">
          <Form.Input
            value={this.state.phone}
            placeholder="phone"
            onChange={(e) => {
              this.setState({
                phone: e.target.value,
              });
            }}
            ref={(n) => {
              this.phoneInput = n;
            }}
            addonBefore={
              <ButtonSelect
                renderTrigger={(value, option, props) => (
                  <Button
                    type="merge"
                    style={{
                      width: 80,
                      height: "100%",
                      borderBottomColor: option ? "black" : "#dddddd",
                    }}
                  >
                    {option ? (
                      <span>{option.callingCode}</span>
                    ) : (
                      props.placeholder
                    )}
                  </Button>
                )}
                valueExtractor={(option) => option.id}
                dropdownContainerStyle={{ maxWidth: 300 }}
                value={this.state.country}
                onChange={this.onCountryChange}
                placeholder="--"
                options={countryOptions}
                showFilter
                renderOption={this.renderCountryOption}
                filterOption={countryFilter}
                placement="bottomLeft"
              />
            }
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" block htmlType="submit">
            Next
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Example;
