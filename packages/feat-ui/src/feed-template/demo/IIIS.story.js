import React from "react";

import FeedTemplateIIIS from "../FeedTemplateIIIS";
import demoData from "./data";

import DimzouCardV from "../../dimzou-card/DimzouCardV";
import DimzouCardII from "../../dimzou-card/DimzouCardII";

class Template extends FeedTemplateIIIS {
  renderI(item, index) {
    return (
      <DimzouCardV
        {...item}
        titleLines={2}
        bodyLines={4}
        key={index}
      />
    );
  }

  renderII(item, index) {
    return (
      <DimzouCardII
        {...item}
        titleLines={2}
        bodyLines={5}
        key={index}
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
