import React from "react";
import FtBlock from "@feat/feat-ui/lib/block";
import FormItem from "@feat/feat-ui/lib/form/FormItem";
import FormLabel from "@feat/feat-ui/lib/form/FormLabel";
import TextInput from "@feat/feat-ui/lib/text-input";
import Button from "@feat/feat-ui/lib/button";
import SquareButton from "@feat/feat-ui/lib/button/SquareButton";
import Loader from "@feat/feat-ui/lib/loader";
import DigitInput from "@feat/feat-ui/lib/digit-input";

import CountrySelect from "./CountrySelect";

import countryOptions from "../button-select/demo/countryOptions";
// const steps = ["PhoneForm", "PhoneVerification", "CreateAccount"];

const DIGIT_COUNT = 5;

const initialState = {
  step: "PhoneForm",
  phone: "",
  callingCode: "86",
  verificationCode: "",
  password: "",
  passwordMode: "text",
  isSubmittingPhone: false,
  isVerifyingPhone: false,
  isCreatingAccount: false,
  accountCreated: false,
};

class Register extends React.Component {
  state = initialState;

  componentDidMount() {
    if (this.state.callingCode && this.phoneInput) {
      this.phoneInput.focus();
    }
  }

  togglePasswordMode = () => {
    const next = this.state.passwordMode === "text" ? "password" : "text";
    this.setState({
      passwordMode: next,
    });
    if (this.passwordInput) {
      this.passwordInput.focus();
    }
  };

  handleCountrySelect = (value, option) => {
    this.setState({
      countryOption: option,
      callingCode: value,
    });
    if (this.phoneInput) {
      this.phoneInput.focus();
    }
  };

  handleCallingCodeInput = (e) => {
    const inputValue = e.target.value;
    const countryOption = countryOptions.find(
      (option) => String(option.calling_code) === inputValue
    );
    this.setState({
      countryOption,
      callingCode: inputValue,
    });
  };

  handlePhoneForm = (e) => {
    e.preventDefault();
    this.setState({
      isSubmittingPhone: true,
    });
    setTimeout(() => {
      this.setState({
        isSubmittingPhone: false,
        step: "PhoneVerification",
      });
    }, 2000);
  };

  handleDigitInput = (value) => {
    this.setState({
      verificationCode: value,
    });
    if (value.length === DIGIT_COUNT) {
      this.setState({
        isVerifyingPhone: true,
      });
      setTimeout(() => {
        this.setState({
          isVerifyingPhone: false,
          step: "CreateAccount",
        });
      }, 2000);
    }
  };

  handleCreateAccount = (e) => {
    e.preventDefault();
    this.setState({
      isCreatingAccount: true,
    });
    setTimeout(() => {
      this.setState({
        isCreatingAccount: false,
        accountCreated: true,
      });
    }, 1000);
  };

  renderPhoneForm() {
    return (
      <form onSubmit={this.handlePhoneForm}>
        <FormItem
          modifier="dashed"
          label={<FormLabel>Country/Region</FormLabel>}
        >
          {({ handleFocus, handleBlur }) => (
            <CountrySelect
              options={countryOptions}
              value={this.state.callingCode}
              onChange={this.handleCountrySelect}
              onOpen={handleFocus}
              onClose={handleBlur}
            />
          )}
        </FormItem>
        <FormItem modifier="dashed" label={<FormLabel>Phone</FormLabel>}>
          {({ handleFocus, handleBlur }) => (
            <TextInput
              disabled={this.state.isSubmittingPhone}
              className="PhoneWidget"
              style={{ paddingLeft: 12 }}
              value={this.state.phone}
              onChange={(e) => {
                this.setState({ phone: e.target.value });
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
              block
              size="md"
              ref={(n) => {
                this.phoneInput = n;
              }}
              addonBefore={
                <TextInput
                  disabled={this.state.isSubmittingPhone}
                  style={{ width: 80, textAlign: "center" }}
                  size="md"
                  value={this.state.callingCode}
                  onChange={this.handleCallingCodeInput}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              }
            />
          )}
        </FormItem>
        <FormItem>
          <Button
            disabled={this.state.isSubmittingPhone}
            className="margin_t_24"
            htmlType="submit"
            block
            size="md"
          >
            {this.state.isSubmittingPhone ? (
              <Loader size="xs" className="margin_r_5" color="inverse">
                Sending Verification Code
              </Loader>
            ) : (
              <span style={{ fontWeight: "bold", verticalAlign: "middle" }}>
                Next
              </span>
            )}
          </Button>
        </FormItem>
      </form>
    );
  }

  renderPhoneVerification() {
    return (
      <form onSubmit={this.handelVerificationForm}>
        <h3 style={{ fontSize: 20, textAlign: "center" }}>Enter Code</h3>
        <p style={{ textAlign: "center" }}>
          We've sent an SMS with an activation code to your phone <br />
          <span
            style={{
              fontWeight: "bold",
              marginLeft: "1em",
              marginRight: "1em",
            }}
          >
            {this.state.callingCode} {this.state.phone}
          </span>
        </p>
        <div style={{ marginTop: 36 }}>
          <DigitInput
            digitCount={5}
            autoFocus
            value={this.state.verificationCode}
            onChange={this.handleDigitInput}
            size="md"
            disabled={this.state.isVerifyingPhone}
          />
        </div>

        <div style={{ marginTop: 36, textAlign: "center" }}>
          <Button
            disabled={this.state.isVerifyingPhone}
            onClick={() => {
              this.setState({
                step: "PhoneForm",
              });
            }}
            type="merge"
          >
            {this.state.isVerifyingPhone ? (
              <Loader size="xs" color="inverse">
                Verifing Code
              </Loader>
            ) : (
              <span>Change Phone</span>
            )}
          </Button>
        </div>
      </form>
    );
  }

  renderCreateAccount() {
    return (
      <form onSubmit={this.handleCreateAccount}>
        <h3 style={{ fontSize: 20, textAlign: "center" }}>Set Password</h3>
        <FormItem modifier="dashed" label={<FormLabel>Password</FormLabel>}>
          {({ handleFocus, handleBlur }) => (
            <TextInput
              size="md"
              autoFocus
              type={this.state.passwordMode}
              value={this.state.password}
              ref={(n) => {
                this.passwordInput = n;
              }}
              onChange={(e) => this.setState({ password: e.target.value })}
              onFocus={handleFocus}
              onBlur={handleBlur}
              addonAfter={
                <SquareButton
                  tabIndex={-1}
                  size="md"
                  onClick={this.togglePasswordMode}
                >
                  {this.state.passwordMode === "text" ? "H" : "S"}
                </SquareButton>
              }
            />
          )}
        </FormItem>
        {/* <FormItem
          modifier="dashed"
          label={<FormLabel>Security Hint</FormLabel>}
        >
          {({ handleFocus, handleBlur }) => (
            <TextInput
              size="md"
              block
              value={this.state.securityKey}
              onChange={e => this.setState({ securityKey: e.target.value })}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          )}
        </FormItem>
        <FormItem
          modifier="dashed"
          label={<FormLabel>Security Code</FormLabel>}
        >
          {({ handleFocus, handleBlur }) => (
            <TextInput
              size="md"
              block
              value={this.state.securityValue}
              onChange={e => this.setState({ securityValue: e.target.value })}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          )}
        </FormItem> */}
        <FormItem>
          <Button
            disabled={this.state.isCreatingAccount}
            htmlType="submit"
            className="margin_t_24"
            block
            size="md"
          >
            {this.state.isCreatingAccount ? (
              <Loader size="xs" color="inverse">
                Creating Account
              </Loader>
            ) : (
              <span style={{ fontWeight: "bold" }}>Create Account</span>
            )}
          </Button>
        </FormItem>
        {this.state.accountCreated && (
          <div
            className="ft-Popover"
            style={{
              position: "absolute",
              width: "80%",
              maxWidth: 300,
              height: 100,
              top: "50%",
              left: "10%",
              transform: "translateY(-50%)",
            }}
          >
            <div>
              Account for has create.{" "}
              <Button onClick={() => this.setState(initialState)}>reset</Button>
            </div>
          </div>
        )}
      </form>
    );
  }

  render() {
    return (
      <div
        style={{
          height: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ marginLeft: "55%" }}>
          <div style={{ width: 400, position: "relative" }}>
            {this[`render${this.state.step}`]()}
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
