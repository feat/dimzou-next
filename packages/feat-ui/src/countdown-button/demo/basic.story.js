import React from "react";
import CountdownButton from "@feat/feat-ui/lib/countdown-button";

const request = () => new Promise((resolve) => {
  setTimeout(resolve, 1000);
});
  /** 倒数按钮的基本使用 */
class Example extends React.Component {
  hanldeClick = () => {
    request().then(
      () => {
        this.btn.start();
      }
    );
  }

  render() {
    return (
      <CountdownButton
        onClick={this.hanldeClick}
        ref={(c) => { this.btn = c; }}
        count={5}
        renderCountDown={(left) => `还有${left}秒`}
        onStart={() => { console.log("start"); }}
        onEnd={() => { console.log("end"); }}
      >
        发送验证码
      </CountdownButton>
    );
  }
}

export default Example;

