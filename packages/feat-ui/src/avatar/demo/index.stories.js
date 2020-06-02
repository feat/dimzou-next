import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import { withKnobs } from "@storybook/addon-knobs";
import withReadme from "storybook-readme/with-readme";
import WithSource from "StoryUtil/_withSource";
import parsePath from "StoryUtil/_parsePath";

import Avatar from "@feat/feat-ui/lib/avatar/Avatar";
import AvatarStamp from "@feat/feat-ui/lib/avatar/AvatarStamp";
import README from "../index.md";

import Playground from "./playground";

const stories = storiesOf("avatar", module);
stories.addDecorator(withReadme(README));
stories.addDecorator(withKnobs);

const req = require.context("./", true, /.story.js$/);
const reqPrism = require.context("!!prismjs-loader?lang=jsx!./", true, /.story.js$/);
req.keys().forEach((filename) => {
  const Story = req(filename).default;
  const storyPrism = reqPrism(filename);
  stories.add(parsePath(filename), withInfo({
    text: Story.__docgenInfo.description,
    propTables: [Avatar, AvatarStamp],
    propTablesExclude: [WithSource, Story],
  })(() => (
    <WithSource source={storyPrism}>
      <Story />
    </WithSource>
  )));
});

stories.add("playground",
  withInfo({
    source: true,
  })(
    Playground
  )
);
