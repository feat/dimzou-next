import React from "react";
import { boolean } from "@storybook/addon-knobs";
import DimzouCardIVPlaceholder from "../DimzouCardIVPlaceholder";
import DimzouCardIV from "../DimzouCardIV";
import demoData from "./demoData";

/** DimzouCard - Type IV */
const Example = () => (
  <DimzouCardIVPlaceholder
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
