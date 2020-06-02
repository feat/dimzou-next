import React from "react";
import { AvatarStamp } from "@feat/feat-ui/lib/avatar";
import demoAvatar from "./avatar.png";

/** avatarstamp提供额外信息 */
const Example = () => (
  <div>
    <AvatarStamp
      avatar={demoAvatar}
      username="Mary Sue"
      uiMeta={["career", "expertise"]}
      uiExtraMeta={["location"]}
      career="A novel writer"
      location="Hong Kong"
      expertise="Web Design"
      type="I"
    />
  </div>
);

export default Example;
