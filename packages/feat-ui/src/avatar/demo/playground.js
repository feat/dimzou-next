import React from "react";
import { boolean, select } from "@storybook/addon-knobs";
import { AvatarStamp } from "@feat/feat-ui/lib/avatar";
import demoAvatar from './avatar.png';
/** avatarstamp提供额外信息 */
const Example = () => (
  <div
    className="padding_12" style={{
      backgroundColor: `${select("Background", { "#aaa": "gray", white: "white" }, "white")}`,
    }}
  >
    <AvatarStamp
      avatar={demoAvatar}
      username="Mary Sue"
      uiMeta={["career"]}
      career="A novel writer"
      uiExtraMeta={["location", "localTime"]}
      location="Hong Kong"
      localTime="19:00"
      type={select("Type", { I: "I", II: "II" }, "I")}
      reverse={boolean("Reverse", false)}
      online={boolean("Online", false)}
      round={boolean("Round", false)}
    />
  </div>
);

export default Example;
