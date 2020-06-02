import React from "react";

import FeedTemplateVII from "../FeedTemplateVII";
import demoData from "./data";

import DimzouCardIII from "../../dimzou-card/DimzouCardIII";

class Template extends FeedTemplateVII {
  renderI(item, index) {
    return (
      <DimzouCardIII
        {...item}
        key={index}
        titleLines={2}
        bodyLines={12}
      />
    );
  }

  renderII(item, index) {
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

/** Template -- FeedTemplateVII */
const Example = (props) => (
  <Template
    items={demoData.slice(0, 5)}
  />
);

export default Example;
