import React from "react";
import { boolean } from "@storybook/addon-knobs";
import DimzouCardIIIPlaceholder from "../DimzouCardIIIPlaceholder";
import DimzouCardIII from "../DimzouCardIII";
import demoData from "./demoData";

/** DimzouCard - Type III */
const Example = () => (
  <DimzouCardIIIPlaceholder
    title={demoData.title}
    body={demoData.body}
    cover={demoData.cover}
    author={demoData.author}
    showAvatar={boolean("showAvatar", true)}
    titleLines={3}
    bodyLines={4}
  />
);

export default Example;
