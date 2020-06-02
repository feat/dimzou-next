import React from "react";

import FeedTemplateXIII from "../FeedTemplateXIII";
import demoData from "./data";

import DimzouCardIV from "../../dimzou-card/DimzouCardIV";


class Template extends FeedTemplateXIII {
  renderI(item, index) {
    return (
      <DimzouCardIV
        {...item}
        key={index}
        titleLines={2}
        bodyLines={6}
      />
    )
  }
}

/** Template -- FeedTemplateXIII */
const Example = (props) => (
  <Template
    items={demoData.slice(0, 1)}
  />
);

export default Example;
