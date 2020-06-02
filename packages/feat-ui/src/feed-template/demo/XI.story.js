import React from "react";

import FeedTemplateXI from "../FeedTemplateXI";
import demoData from "./data";

import DimzouCardV from "../../dimzou-card/DimzouCardV";
import DimzouCardI from "../../dimzou-card/DimzouCardI";


class Template extends FeedTemplateXI {
  renderI(item, index) {
    return (
      <DimzouCardV
        {...item}
        key={index}
        titleLines={2}
        bodyLines={2}
      />
    );
  }

  renderII(item, index) {
    return (
      <DimzouCardI
        {...item}
        key={index}
        titleLines={2}
        bodyLines={2}
      />
    );
  }
}

/** Template -- FeedTemplateXI */
const Example = (props) => (
  <Template
    items={demoData.slice(0, 7)}
  />
);

export default Example;
