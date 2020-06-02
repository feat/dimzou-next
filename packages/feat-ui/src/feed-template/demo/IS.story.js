import React from "react";

import FeedTemplateIS from "../FeedTemplateIS";
import demoData from "./data";

import DimzouCardIII from "../../dimzou-card/DimzouCardIII";
import DimzouCardI from "../../dimzou-card/DimzouCardI";

class Template extends FeedTemplateIS {
  renderI(item, index) {
    return (
      <DimzouCardIII
        {...item}
        key={index}
        titleLines={4}
        bodyLines={3}
      />
    )
  }

  renderII(item, index) {
    return (
      <DimzouCardI
        {...item}
        key={index}
        titleLines={2}
        bodyLines={3}
        layoutType="J"
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
