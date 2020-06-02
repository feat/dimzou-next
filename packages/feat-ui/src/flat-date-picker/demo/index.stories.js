import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";

import WithSource from "StoryUtil/_withSource";
import parsePath from "StoryUtil/_parsePath";
import FlatDatePicker from "@feat/feat-ui/lib/flat-date-picker";

import { withKnobs } from "@storybook/addon-knobs";

const stories = storiesOf("flat-date-picker", module);
stories.addDecorator(withKnobs);

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
      propTables: [FlatDatePicker],
      propTablesExclude: [WithSource, Story],
    })(() => (
      <WithSource source={storyPrism}>
        <Story />
      </WithSource>
    ))
  );
});
