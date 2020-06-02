import React from "react";
import PropTypes from "prop-types";
import Pagination from "@feat/feat-ui/lib/pagination";
import { text, boolean, number, select } from "@storybook/addon-knobs";

const pageOp = {
  range: true,
  min: 10,
  max: 200,
  step: 5,
};
const disOp = {
  range: true,
  min: 1,
  max: 20,
  step: 1,
};

const Example = () => (
  <div>
    <Pagination
      total={number("total", 100, pageOp)}
      pageSize={number("pageSize", 10, pageOp)}
      displayNum={number("displayNum", 5, disOp)}
      marginPagesDisplayed={number("margin", 2, disOp)}
      showQuickJumper={boolean("jumper", true)}
      size={select("size", { sm: "sm", md: "md" }, "md")}
    />
  </div>
);

export default Example;
