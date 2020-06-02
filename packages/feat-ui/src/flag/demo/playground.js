import React from "react";
import PropTypes from "prop-types";
import Flag from "@feat/feat-ui/lib/flag";
import { text } from "@storybook/addon-knobs";

const Example = () => (
  <div style={{ margin: "20px auto" }}>
    <Flag
      country={text("country", "china")}
    />
  </div>
);

export default Example;
