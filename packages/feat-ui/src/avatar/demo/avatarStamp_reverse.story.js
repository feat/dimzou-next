import React from "react";
import { AvatarStamp } from "@feat/feat-ui/lib/avatar";
import demoAvatar from "./avatar.png";
const Example = () => (
  <div style={{ backgroundColor: "#333", padding: "15px" }}>
    <AvatarStamp
      type="I"
      avatar={demoAvatar}
      username="kongkx"
      expertise="Drawing"
      uiMeta={["expertise"]}
      reverse
    />
  </div>
);

export default Example;
