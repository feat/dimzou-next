import React from "react";

import FeedTemplateIII from "../FeedTemplateIII";
import demoData from "./data";

import DimzouCardIII from "../../dimzou-card/DimzouCardIII";
import DimzouCardII from "../../dimzou-card/DimzouCardII";

class Template extends FeedTemplateIII {
  renderI(item, index) {
    return (
      <DimzouCardIII
        {...item}
        titleLines={2}
        bodyLines={12}
        key={index}
      />
    )
  }

  renderII(item, index) {
    return (
      <DimzouCardII
        {...item}
        layoutType="L"
        titleLines={2}
        bodyLines={7}
        key={index}
      />
    )
  }

}

/** Template -- I */
const Example = (props) => (
  <Template
    items={demoData.slice(0, 5)}
  />
);

export default Example;
