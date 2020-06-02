import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import withReadme from "storybook-readme/with-readme";
import WithSource from "StoryUtil/_withSource";
import parsePath from "StoryUtil/_parsePath";

// import Dropdown from "@feat/feat-ui/lib/dropdown";
import Searchbox from "../SearchBox";

const stories = storiesOf("search-input", module);

const req = require.context("./", true, /.story.js$/);
const reqPrism = require.context(
  "!!prismjs-loader?lang=jsx!./",
  true,
  /.story.js$/
);
req.keys().forEach((filename) => {
  const Story = req(filename).default;
  const storyPrism = reqPrism(filename);
  stories.add(
    parsePath(filename),
    withInfo({
      text: "filename",
      propTables: [Searchbox],
      propTablesExclude: [WithSource, Story],
    })(() => (
      <WithSource source={storyPrism}>
        <Story />
      </WithSource>
    ))
  );
});
