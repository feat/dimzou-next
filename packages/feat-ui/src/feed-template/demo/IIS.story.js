import React from "react";

import FeedTemplateIIS from "../FeedTemplateIIS";
import demoData from "./data";

import DimzouCardIII from "../../dimzou-card/DimzouCardIII";

class Template extends FeedTemplateIIS {
  renderI(item, index) {
    return (
      <DimzouCardIII
        {...item}
        titleLines={3}
        bodyLines={4}
        key={index}
      />
    )
  }
}

/** Template -- I */
const Example = (props) => (
  <Template
    items={demoData.slice(0, 7)}
  />
);

export default Example;
