import React from "react";
import { AvatarStamp } from "@feat/feat-ui/lib/avatar";

const DemoAvatar = () => (
  <div style={{ width: "40px", height: "40px", backgroundColor: "#cccc88" }} />
);

/** Avatarstamp 自定义 avatar 组件 */
const Example = () => (
  <div>
    <AvatarStamp
      username="Mary Sue"
      uiMeta={["career"]}
      career="A novel writer"
      uiExtraMeta={["location"]}
      location="Hong Kong"
      type="II"
      avatar={<DemoAvatar />}
      onAvatarClick={() => {
        alert("AvatarClicked");
      }}
      onUsernameClick={() => {
        alert("clicked");
      }}
    />
  </div>
);

export default Example;
