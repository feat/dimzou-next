import React from "react";
import { action } from "@storybook/addon-actions";
import CountdownButton from "@feat/feat-ui/lib/countdown-button";

/** Clickable when counting down */
class Example extends React.Component {
  handleClick = () => {
    console.log('click');
  }

  render() {
    return (
      <CountdownButton
        onClick={(e) => {
          action('onClick')(e);
        }}
        ref={(c) => { this.btn = c; }}
        count={30}
        left={30}
        renderCountDown={(left) => `Redirect (${left}s)`}
        onStart={() => { console.log("start"); }}
        onEnd={() => { console.log("end"); }}
        disabledWhenCountingDown={false}
      >
        Redirect
      </CountdownButton>
    );
  }
}

export default Example;

