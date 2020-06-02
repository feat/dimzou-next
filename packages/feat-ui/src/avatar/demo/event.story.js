import React from "react";
import { AvatarStamp } from "@feat/feat-ui/lib/avatar";
import demoAvatar from './avatar.png';

/** Avatarstamp 点击事件 */
const Example = () => (
  <div>
    <AvatarStamp
      avatar={demoAvatar}
      username="Mary Sue"
      uiMeta={["career"]}
      career="A novel writer"
      uiExtraMeta={["location"]}
      location="Hong Kong"
      type="II"
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
