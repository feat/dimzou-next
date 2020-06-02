import React from "react";

import FeedTemplateXII from "../FeedTemplateXII";
import demoData from "./data";

import DimzouCardV from "../../dimzou-card/DimzouCardV";
import DimzouCardI from "../../dimzou-card/DimzouCardI";

class Template extends FeedTemplateXII {
  renderI(item, index) {
    return (
      <DimzouCardV
        {...item}
        key={index}
        titleLines={2}
        bodyLines={6}
      />
    );
  }

  renderII(item, index) {
    return (
      <DimzouCardI
        {...item}
        key={index}
        layoutType="L"
        titleLines={2}
        bodyLines={5}
      />
    );
  }
}

/** Template -- FeedTemplateXII */
const Example = (props) => (
  <Template
    items={demoData.slice(0, 7)}
  />
);

export default Example;
