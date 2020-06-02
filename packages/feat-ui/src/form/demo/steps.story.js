import React from "react";
import classNames from "classnames";
import Form from "@feat/feat-ui/lib/form";
import Button from "@feat/feat-ui/lib/button";
import ButtonSelect from "@feat/feat-ui/lib/button-select";
import Modal from "@feat/feat-ui/lib/modal";

import countryOptions from "./countryOptions";
import FormLabel from "../FormLabel";
const formStyle = {
  maxWidth: 300,
  margin: "100px auto",
};

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

const getInitState = () => ({
  country: "",
  phone: "",
  code: "",
  firstname: "",
  lastname: "",
  step: 1,
});

class Example extends React.Component {
  state = getInitState();

  handleCountryChange = (value) => {
    console.log(value);
    this.phoneInput && this.phoneInput.focus();
    this.setState({
      country: value,
    });
  };

  handleCodeInput = (e) => {
    const value = e.target.value;
    if (value.length > 6 || this.state.isSubmitting) {
      return;
    }
    this.setState(
      {
        code: value,
      },
      this.tryToSubmitVerifyForm
    );
  };

  handlePhoneFormSubmit = (e) => {
    e.preventDefault();
    const { country, phone } = this.state;
    this.setState({
      isSubmitting: true,
    });
    setTimeout(() => {
      this.setState({
        step: 2,
        isSubmitting: false,
      });
    }, 2000);
  };

  tryToSubmitVerifyForm = (e) => {
    const { code } = this.state;
    if (code.length === 6) {
      this.veirfyFormSubmitBtn && this.veirfyFormSubmitBtn.click();
    }
  };

  handleVerifyFormSubmit = (e) => {
    e.preventDefault();
    const { code } = this.state;
    this.setState({
      isSubmitting: true,
    });
    setTimeout(() => {
      this.setState({
        step: 3,
        isSubmitting: false,
      });
    }, 2000);
  };

  handleProfileFormSubmit = (e) => {
    e.preventDefault();
    const { firstname, lastname } = this.state;
    this.setState({
      isSubmitting: true,
    });
    setTimeout(() => {
      Modal.success({
        title: "Success",
        content: `Profile: ${firstname} ${lastname}`,
      });
      this.setState({
        isSubmitting: false,
        hasFinished: true,
      });
    }, 2000);
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

  renderVerifyForm() {
    return (
      <Form style={formStyle} onSubmit={this.handleVerifyFormSubmit}>
        <Form.Item label={<FormLabel>Code</FormLabel>}>
          {({ handleFocus, handleBlur }) => (
            <Form.Input
              autoFocus
              block
              value={this.state.code}
              placeholder=" "
              onChange={this.handleCodeInput}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button
            ref={(n) => {
              this.veirfyFormSubmitBtn = n;
            }}
            block
            type="primary"
            htmlType="submit"
            disabled={this.state.isSubmitting}
          >
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    );
  }

  renderPhoneForm() {
    return (
      <Form style={formStyle} onSubmit={this.handlePhoneFormSubmit}>
        <Form.Item label={<FormLabel>Country</FormLabel>}>
          {({ handleFocus, handleBlur }) => (
            <ButtonSelect
              renderTrigger={(value, option, props) => (
                <Button
                  block
                  style={{
                    textAlign: "left",
                  }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  {option ? (
                    <span>{option.name}</span>
                  ) : (
                    <span
                      style={{ fontSize: 14, color: "#9D9D9C" }}
                      className="t-placeholder"
                    >
                      {props.placeholder}
                    </span>
                  )}
                </Button>
              )}
              valueExtractor={(option) => option.id}
              dropdownContainerStyle={{ maxWidth: 300 }}
              value={this.state.country}
              onChange={this.handleCountryChange}
              placeholder="Select Country"
              options={countryOptions}
              showFilter
              renderOption={this.renderCountryOption}
              filterOption={countryFilter}
              placement="bottomLeft"
              onOpen={handleFocus}
              onClose={handleBlur}
            />
          )}
        </Form.Item>
        <Form.Item label={<FormLabel>Phone</FormLabel>}>
          {({ handleFocus, handleBlur }) => (
            <Form.Input
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
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
              onFocus={handleFocus}
              onBlur={handleBlur}
              addonBefore={
                <ButtonSelect
                  renderTrigger={(value, option, props) => (
                    <Button
                      style={{
                        width: 80,
                        height: "100%",
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                      }}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
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
                  onChange={this.handleCountryChange}
                  placeholder="--"
                  options={countryOptions}
                  showFilter
                  renderOption={this.renderCountryOption}
                  filterOption={countryFilter}
                  placement="bottomLeft"
                  onOpen={handleFocus}
                  onBlur={handleBlur}
                />
              }
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            block
            htmlType="submit"
            disabled={this.state.isSubmitting}
          >
            Next
          </Button>
        </Form.Item>
        {this.state.isSubmitting && (
          <span className="t-label">Generating Key...</span>
        )}
      </Form>
    );
  }

  renderProfileForm() {
    return (
      <Form style={formStyle} onSubmit={this.handleProfileFormSubmit}>
        <Form.Item label={<FormLabel>Firstname</FormLabel>}>
          {({ handleFocus, handleBlur }) => (
            <Form.Input
              value={this.state.firstname}
              placeholder=""
              autoFocus
              onChange={(e) => {
                this.setState({
                  firstname: e.target.value,
                });
              }}
              block
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          )}
        </Form.Item>
        <Form.Item label={<FormLabel>Lastname</FormLabel>}>
          {({ handleFocus, handleBlur }) => (
            <Form.Input
              value={this.state.lastname}
              placeholder=""
              onChange={(e) => {
                this.setState({
                  lastname: e.target.value,
                });
              }}
              block
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            block
            htmlType="submit"
            disabled={this.state.isSubmitting}
          >
            Submit
          </Button>
        </Form.Item>
        {this.state.hasFinished && (
          <Button
            onClick={() => {
              this.setState(getInitState());
            }}
          >
            Reset
          </Button>
        )}
      </Form>
    );
  }

  render() {
    if (this.state.step === 1) {
      return this.renderPhoneForm();
    }
    if (this.state.step === 2) {
      return this.renderVerifyForm();
    }
    if (this.state.step === 3) {
      return this.renderProfileForm();
    }
    return null;
  }
}

export default Example;
