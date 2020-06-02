import React from "react";
import PropTypes from "prop-types";
import { text, number } from "@storybook/addon-knobs";

import LazyImage from "../index";

const Example = () => (
  <div style={{ margin: "20px auto" }}>
    <LazyImage
      src={text("src", "http://lorempixel.com/640/480/fashion")}
      ratio={number("ratio", (16 / 9))}
      offset={number("ratio", 50)}
    />
  </div>
);

export default Example;
