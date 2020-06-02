import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import WithSource from "StoryUtil/_withSource";
import parsePath from "StoryUtil/_parsePath";

import TextInput from "@feat/feat-ui/lib/text-input";

const stories = storiesOf("text-input", module);

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
      text: Story.__docgenInfo.description,
      propTables: [TextInput],
      propTablesExclude: [WithSource, Story],
    })(() => (
      <WithSource source={storyPrism}>
        <Story />
      </WithSource>
    ))
  );
});
