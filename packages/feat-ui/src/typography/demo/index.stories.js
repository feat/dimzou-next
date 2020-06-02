import React from "react";
import { storiesOf } from "@storybook/react";
import parsePath from "StoryUtil/_parsePath";

const stories = storiesOf("typography", module);

const req = require.context("./", true, /.story.js$/);
// const reqPrism = require.context("!!prismjs-loader?lang=jsx!./", true, /.story.js$/);
req.keys().forEach((filename) => {
  const Story = req(filename).default;
  // const storyPrism = reqPrism(filename);
  stories.add(parsePath(filename), () => <Story />);
});
