import React from "react";
import { storiesOf } from "@storybook/react";
import withReadme from "storybook-readme/with-readme";
import { withInfo } from "@storybook/addon-info";
import WithSource from "StoryUtil/_withSource";
import parsePath from "StoryUtil/_parsePath";
import { withKnobs } from "@storybook/addon-knobs";

import README from "../index.md";
import Button from "../index";
import playground from "./playground";


const stories = storiesOf("button", module);
stories.addDecorator(withReadme(README)).addDecorator(withKnobs);

const req = require.context("./", true, /.story.js$/);
const reqPrism = require.context("!!prismjs-loader?lang=jsx!./", true, /.story.js$/);
req.keys().forEach((filename) => {
  const Story = req(filename).default;
  const storyPrism = reqPrism(filename);
  stories.add(parsePath(filename), withInfo({
    text: Story.__docgenInfo.description,
    propTables: [Button],
    propTablesExclude: [WithSource, Story],
  })(() => (
    <WithSource source={storyPrism}>
      <Story />
    </WithSource>
  )));
});

stories.add("playground", withInfo({
  text: "playground",
  source: true,
})(playground));
