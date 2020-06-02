import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import withReadme from "storybook-readme/with-readme";
import WithSource from "StoryUtil/_withSource";
import parsePath from "StoryUtil/_parsePath";
import { withKnobs } from "@storybook/addon-knobs";
import Pagination from "@feat/feat-ui/lib/pagination";

import README from "../index.md";
import Playground from "./playground";


const stories = storiesOf("pagination", module);
stories.addDecorator(withReadme(README)).addDecorator(withKnobs);

const req = require.context("./", true, /.story.js$/);
const reqPrism = require.context("!!prismjs-loader?lang=jsx!./", true, /.story.js$/);
req.keys().forEach((filename) => {
  const Story = req(filename).default;
  const storyPrism = reqPrism(filename);
  stories.add(parsePath(filename), withInfo({
    text: "filename",
    propTables: [Pagination],
    propTablesExclude: [WithSource, Story],
  })(() => (
    <WithSource source={storyPrism}>
      <Story />
    </WithSource>
  )));
});

stories.add("playground", withInfo({
  source: true,
  text: "playground",
})(Playground));
