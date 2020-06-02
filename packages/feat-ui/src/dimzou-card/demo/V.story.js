import React from "react";
import { boolean } from "@storybook/addon-knobs";
import DimzouCardVPlaceholder from "../DimzouCardVPlaceholder";
import DimzouCardV from "../DimzouCardV";
import demoData from "./demoData";

/** DimzouCard - Type V */
const Example = () => (
  <DimzouCardV
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
