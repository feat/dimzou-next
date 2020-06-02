import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import { withInfo } from "@storybook/addon-info";
import WithSource from "StoryUtil/_withSource";
import parsePath from "StoryUtil/_parsePath";

import SvgIcon from "@feat/feat-ui/lib/svg-icon";
import Playground from "./playground";

const stories = storiesOf("svg-icon", module).addDecorator(withKnobs);

const req = require.context("./", true, /.story.js$/);
const reqPrism = require.context("!!prismjs-loader?lang=jsx!./", true, /.story.js$/);
req.keys().forEach((filename) => {
  const Story = req(filename).default;
  const storyPrism = reqPrism(filename);
  stories.add(parsePath(filename), withInfo({
    text: Story.__docgenInfo.description || "",
    propTables: [SvgIcon],
    propTablesExclude: [WithSource, Story],
  })(() => (
    <WithSource source={storyPrism}>
      <Story />
    </WithSource>
  )));
});

stories.add("playground", withInfo({
  source: true,
  text: "size",
})(Playground));
