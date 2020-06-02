import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import withReadme from "storybook-readme/with-readme";
import WithSource from "StoryUtil/_withSource";
import parsePath from "StoryUtil/_parsePath";

// import README from "../index.md";
// import playground from "./playground";
import Template from "@feat/feat-ui/lib/feed-template";

import { withKnobs } from "@storybook/addon-knobs";
import "./demo.scss";

const stories = storiesOf("feed-templates", module);
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
      propTablesExclude: [WithSource, Story],
    })(() => (
      <WithSource source={storyPrism}>
        <Story />
      </WithSource>
    ))
  );
});

// stories.add("playground", withInfo({
//   text: "playground",
//   source: true
// })(playground));
