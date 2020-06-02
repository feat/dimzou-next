import React from "react";
import DimzouCardVIPlaceholder from "../DimzouCardVIPlaceholder";
import DimzouCardVI from "../DimzouCardVI";
import demoData from "./demoData";

/** DimzouCard - Type VI */
const Example = () => (
  <DimzouCardVIPlaceholder
    title={demoData.title}
    body={demoData.body}
    cover={demoData.cover}
    author={demoData.author}
    meta={<div>TODO</div>}
    isTranslation
    titleLines={3}
    bodyLines={4}
  />
);

export default Example;
