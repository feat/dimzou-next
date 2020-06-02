import React from 'react';
import CountdownButton from "@feat/feat-ui/lib/countdown-button";

/** 一加载即处于倒数状态，left设置为剩余秒数,onEnd正常触发。 */
const Example =     () => (
  <CountdownButton
    count={15}
    left={10}
    renderCountDown={(left) => `还有${left}秒`}
    onStart={() => { console.log("start"); }}
    onEnd={() => { console.log("end"); }}
  >
           发送验证码
  </CountdownButton>
)

export default Example;
