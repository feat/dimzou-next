import React from "react";

import FeedTemplateI from "../FeedTemplateI";
import DimzouCardIII from "../../dimzou-card/DimzouCardIII";
import DimzouCardII from "../../dimzou-card/DimzouCardII";

import demoData from "./data";

class Template extends FeedTemplateI {
  onItemClick = (item) => {
    console.log(item);
  }

  renderI(item, index, itemProps = {}) {
    return (
      <DimzouCardIII
        {...item}
        onClick={() => itemProps.onClick(item)}
        titleLines={4}
        bodyLines={5}
        key={index}
      />
    );
  }

  renderII(item, index, itemProps) {
    return (
      <DimzouCardII
        {...item}
        onClick={() => itemProps.onClick(item)}
        titleLines={2}
        bodyLines={4}
        key={index}
      />
    );
  }

  renderIII(item, index) {
    return (
      <DimzouCardIII
        {...item}
        titleLines={3}
        bodyLines={12}
        key={index}
      />
    );
  }

  renderIV(item, index) {
    return (
      <DimzouCardII
        {...item}
        titleLines={2}
        bodyLines={4}
        key={index}
      />
    );
  }

  renderV(item, index) {
    return (
      <DimzouCardIII
        {...item}
        titleLines={2}
        bodyLines={6}
        key={index}
      />
    );
  }
}

/** Template -- I */
const Example = (props) => (
  <Template
    items={demoData.slice(0, 10)}
    itemProps={{
      onClick: (item) => {
        console.log(item);
      },
    }}
  />
);

export default Example;
