import React from "react";
import FtBlock from "@feat/feat-ui/lib/block";
import FormItem from "@feat/feat-ui/lib/form/FormItem";
import FormLabel from "@feat/feat-ui/lib/form/FormLabel";
import TextInput from "@feat/feat-ui/lib/text-input";
import Button from "@feat/feat-ui/lib/button";
import SquareButton from "@feat/feat-ui/lib/button/SquareButton";
import Loader from "@feat/feat-ui/lib/loader";
import DigitInput from "@feat/feat-ui/lib/digit-input";
import CountdownButton from "@feat/feat-ui/lib/countdown-button";

import CountrySelect from "./CountrySelect";

import countryOptions from "../button-select/demo/countryOptions";

const request = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
class LoginChange extends React.Component {
  state = {
    step: "PhoneForm",
    phone: "",
    callingCode: "86",
    answer: "",
    vCode: "",
    password: "",
    passwordMode: "text",

    isSubmittingPhone: false,
    isVerifyingAnswer: false,
    isSubmittingChange: false,
    isCreatingAccount: false,
  };

  handleLogin = () => {
    this.setState({
      step: "PhoneForm",
    });
  };

  handleClick = () => {
    request().then(() => {
      this.btn.start();
    });
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

  handlePhoneForm = (e) => {
    e.preventDefault();
    this.setState({
      isSubmittingPhone: true,
    });
    setTimeout(() => {
      this.setState({
        isSubmittingPhone: false,
        step: "SecurityAnswer",
      });
    }, 2000);
  };

  handleSelectForm = (e) => {
    e.preventDefault();
    const form = e.target;
    const answer = form.answer.value;
    console.log("answer:", answer);
    this.setState({
      isVerifyingAnswer: true,
    });
    setTimeout(() => {
      this.setState({
        isVerifyingAnswer: false,
        step: "ChangeSelect",
      });
    }, 2000);
  };

  handlePhoneChange = (e) => {
    e.preventDefault();
    this.setState({
      isSubmittingChange: true,
    });
    setTimeout(() => {
      this.setState({
        isSubmittingChange: false,
        step: "PhoneChangeSuccess",
      });
    }, 2000);
  };

  handlePasswordChange = (e) => {
    e.preventDefault();
    this.setState({
      isCreatingAccount: true,
    });
    setTimeout(() => {
      this.setState({
        isCreatingAccount: false,
        step: "PasswordChangeSuccess",
      });
    }, 2000);
  };

  renderPhoneChangeSuccess() {
    return (
      <div>
        <div style={{ textAlign: "center" }}>
          <h4>登录账号修改成功</h4>
          <span>您的登录账号已成功修改。新的登录账号为:</span>
          <h4>+86 1234567890</h4>
          <Button
            size="md"
            style={{ padding: "0 24px" }}
            onClick={this.handleLogin}
          >
            立即登录
          </Button>
        </div>
      </div>
    );
  }

  renderPasswordChangeSuccess() {
    return (
      <div>
        <div style={{ textAlign: "center" }}>
          <h4>密码重置成功</h4>
          <span>您的账号密码已重置成功</span>
          <br />
          <Button
            size="md"
            style={{ padding: "0 24px", marginTop: 32 }}
            onClick={this.handleLogin}
          >
            立即登录
          </Button>
        </div>
      </div>
    );
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

  renderPasswordChange() {
    return (
      <form onSubmit={this.handlePasswordChange}>
        <div style={{ textAlign: "center" }}>
          <h4>重置密码 </h4>
          <span>请输入新密码</span>
        </div>
        <FormItem modifier="dashed" label={<FormLabel>密码</FormLabel>}>
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
                正在为您重置密码...
              </Loader>
            ) : (
              <span style={{ fontWeight: "bold" }}>提交</span>
            )}
          </Button>
        </FormItem>
        <Button
          type="merge"
          size="md"
          onClick={() => {
            this.setState({
              step: "ChangeSelect",
            });
          }}
        >
          重新选择
        </Button>
      </form>
    );
  }

  renderPhoneChange() {
    return (
      <form onSubmit={this.handlePhoneChange}>
        <div style={{ textAlign: "center" }}>
          <h4>修改登录账号</h4>
        </div>
        <FormItem modifier="dashed" label={<FormLabel>国家/区域</FormLabel>}>
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
        <FormItem modifier="dashed" label={<FormLabel>手机</FormLabel>}>
          {({ handleFocus, handleBlur }) => (
            <TextInput
              disabled={this.state.isSubmittingChange}
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
                  disabled={this.state.isSubmittingChange}
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
        <FormItem modifie="dashed" label={<FormLabel>验证码</FormLabel>}>
          {({ handleFocus, handleBlur }) => (
            <TextInput
              value={this.state.vCode}
              onChange={(e) => {
                this.setState({ vCode: e.target.value });
              }}
              size="md"
              block
              onFocus={handleFocus}
              onBlur={handleBlur}
              addonAfter={
                <CountdownButton
                  size="md"
                  onClick={this.handleClick}
                  ref={(c) => {
                    this.btn = c;
                  }}
                  count={60}
                  renderCountDown={(left) => `${left}s`}
                  style={{ width: "7rem" }}
                  onStart={() => {
                    console.log("start");
                  }}
                  onEnd={() => {
                    console.log("end");
                  }}
                >
                  获取验证码
                </CountdownButton>
              }
            />
          )}
        </FormItem>
        <FormItem>
          <Button
            disabled={this.state.isSubmittingChange}
            className="margin_t_24"
            htmlType="submit"
            block
            size="md"
          >
            {this.state.isSubmittingChange ? (
              <Loader size="xs" className="margin_r_5" color="inverse">
                正在为您修改登录账号...
              </Loader>
            ) : (
              <span style={{ fontWeight: "bold", verticalAlign: "middle" }}>
                提交
              </span>
            )}
          </Button>
        </FormItem>
        <Button
          type="merge"
          size="md"
          onClick={() => {
            this.setState({
              step: "ChangeSelect",
            });
          }}
        >
          重新选择
        </Button>
      </form>
    );
  }

  renderSecurityAnswer() {
    return (
      <form onSubmit={this.handleSelectForm}>
        <div style={{ textAlign: "center" }}>
          <h4>输入答案</h4>
          <span>请输入您的安全答案</span>
        </div>
        <FormItem modifier="dashed" label={<FormLabel>提示</FormLabel>}>
          <TextInput block size="md" value="asd" disabled />
        </FormItem>
        <FormItem modifier="dashed" label={<FormLabel>答案</FormLabel>}>
          {({ handleFocus, handleBlur }) => (
            <TextInput
              block
              size="md"
              value={this.state.answer}
              name="answer"
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={(e) => {
                this.setState({ answer: e.target.value });
              }}
            />
          )}
        </FormItem>
        <FormItem>
          <Button
            disabled={this.state.isVerifyingAnswer}
            className="margin_t_24"
            htmlType="submit"
            block
            size="md"
          >
            {this.state.isVerifyingAnswer ? (
              <Loader size="xs" className="margin_r_5" color="inverse">
                验证中...
              </Loader>
            ) : (
              <span style={{ fontWeight: "bold", verticalAlign: "middle" }}>
                验证
              </span>
            )}
          </Button>
        </FormItem>
      </form>
    );
  }

  renderPhoneForm() {
    return (
      <form onSubmit={this.handlePhoneForm}>
        <div style={{ textAlign: "center" }}>
          <h4>账号验证</h4>
        </div>
        <FormItem modifier="dashed" label={<FormLabel>国家/区域</FormLabel>}>
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
        <FormItem modifier="dashed" label={<FormLabel>手机</FormLabel>}>
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
                账号验证中...
              </Loader>
            ) : (
              <span style={{ fontWeight: "bold", verticalAlign: "middle" }}>
                下一步
              </span>
            )}
          </Button>
        </FormItem>
      </form>
    );
  }

  renderChangeSelect = () => (
    <div>
      <div style={{ textAlign: "center" }}>
        <h4>验证通过</h4>
        <span>请选择您要执行的操作</span>
      </div>
      <FormItem>
        <Button
          block
          size="md"
          style={{ marginBottom: "30px" }}
          onClick={() => {
            this.setState({ step: "PasswordChange" });
          }}
        >
            重置密码
        </Button>
        <Button
          block
          size="md"
          onClick={() => {
            this.setState({ step: "PhoneChange" });
          }}
        >
            修改登录账号
        </Button>
      </FormItem>
    </div>
  );

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

export default LoginChange;
