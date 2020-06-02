import React from "react";

import FeedTemplateX from "../FeedTemplateX";
import demoData from "./data";

import DimzouCardIII from "../../dimzou-card/DimzouCardIII";
import DimzouCardII from "../../dimzou-card/DimzouCardII";

class Template extends FeedTemplateX {
  renderI(item, index) {
    return (
      <DimzouCardIII
        {...item}
        key={index}
        titleLines={2}
        bodyLines={5}
      />
    );
  }

  renderII(item, index) {
    return (
      <DimzouCardII
        {...item}
        key={index}
        titleLines={2}
        bodyLines={7}
      />
    );
  }
}

/** Template -- FeedTemplateX */
const Example = (props) => (
  <Template
    items={demoData.slice(0, 4)}
  />
);

export default Example;
