import React from "react";

import FeedTemplateV from "../FeedTemplateV";
import demoData from "./data";

import DimzouCardIII from "../../dimzou-card/DimzouCardIII";

class Template extends FeedTemplateV {
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
}

/** Template -- I */
const Example = (props) => (
  <Template
    items={demoData.slice(0, 6)}
  />
);

export default Example;
