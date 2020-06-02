import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import withReadme from "storybook-readme/with-readme";
import { withKnobs } from "@storybook/addon-knobs";
import WithSource from "StoryUtil/_withSource";
import parsePath from "StoryUtil/_parsePath";

import Popover from "@feat/feat-ui/lib/popover";
import README from "../index.md";
import Playground from "./playground";


const stories = storiesOf("popover", module);
stories.addDecorator(withReadme(README));
stories.addDecorator(withKnobs);
stories.add("playground", withInfo({
  text: "placement play",
  propTables: [Popover],
})(
  Playground
));

const req = require.context("./", true, /.story.js$/);
const reqPrism = require.context("!!prismjs-loader?lang=jsx!./", true, /.story.js$/);
req.keys().forEach((filename) => {
  const Story = req(filename).default;
  const storyPrism = reqPrism(filename);
  stories.add(parsePath(filename), withInfo({
    text: "filename",
    propTables: [Popover],
    propTablesExclude: [WithSource, Story],
  })(() => (
    <WithSource source={storyPrism}>
      <Story />
    </WithSource>
  )));
});
