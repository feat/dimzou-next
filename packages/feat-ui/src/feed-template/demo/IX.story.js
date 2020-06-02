import React from "react";

import FeedTemplateIX from "../FeedTemplateIX";
import demoData from "./data";

import DimzouCardIII from "../../dimzou-card/DimzouCardIII";
import DimzouCardII from "../../dimzou-card/DimzouCardII";

class Template extends FeedTemplateIX {
  renderI(item, index) {
    return (
      <DimzouCardIII
        {...item}
        key={index}
        titleLines={2}
        bodyLines={8}
      />
    );
  }

  renderII(item, index) {
    return (
      <DimzouCardIII
        {...item}
        key={index}
        titleLines={2}
        bodyLines={5}
      />
    );
  }

  renderIII(item, index) {
    return (
      <DimzouCardII
        {...item}
        key={index}
        titleLines={2}
        bodyLines={5}
      />
    );
  }
}

/** Template -- I */
const Example = (props) => (
  <Template
    items={demoData.slice(0, 7)}
  />
);

export default Example;
