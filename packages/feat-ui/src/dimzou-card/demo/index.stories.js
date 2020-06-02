import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import { withKnobs } from "@storybook/addon-knobs";
import withReadme from "storybook-readme/with-readme";
import WithSource from "StoryUtil/_withSource";
import parsePath from "StoryUtil/_parsePath";
import DimzouCardII from "../DimzouCardII";

const stories = storiesOf("dimzou-card", module);
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
      text: Story.__docgenInfo.description,
      propTables: [DimzouCardII],
      propTablesExclude: [WithSource, Story],
    })(() => (
      <WithSource source={storyPrism}>
        <Story />
      </WithSource>
    ))
  );
});
