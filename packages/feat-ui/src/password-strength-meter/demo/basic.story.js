import React from "react";
import PropTypes from "prop-types";
import Input from "@feat/feat-ui/lib/form/FormInput";
import PasswordStrengthMeter from "@feat/feat-ui/lib/password-strength-meter";

export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }

  render() {
    return (
      <div style={{ width: "400px", margin: "0 auto" }}>
        <div className="margin_b_12">
          <Input
            style={{ fontSize: 24 }}
            type="text"
            onChange={(e) => {
              this.setState({ value: e.target.value });
            }}
            placeholder="enter password"
          />
        </div>
        <div style={{ height: 60 }}>
          <PasswordStrengthMeter value={this.state.value} />
        </div>
      </div>
    );
  }
}
