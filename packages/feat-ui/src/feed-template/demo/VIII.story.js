import React from "react";

import FeedTemplateVIII from "../FeedTemplateVIII";
import demoData from "./data";

import DimzouCardIII from "../../dimzou-card/DimzouCardIII";

class Template extends FeedTemplateVIII {
  renderI(item, index) {
    return (
      <DimzouCardIII
        {...item}
        key={index}
        titleLines={3}
        bodyLines={5}
      />
    );
  }
}

/** Template -- FeedTemplateVIII */
const Example = (props) => (
  <Template
    items={demoData.slice(0, 8)}
  />
);

export default Example;
