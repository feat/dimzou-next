import React from "react";
import { boolean } from "@storybook/addon-knobs";
import DimzouCardI from "../DimzouCardI";
import DimzouCardIPlaceholder from "../DimzouCardIPlaceholder";
import demoData from "./demoData";
/** DimzouCard - Type I */
const Example = () => (
  <DimzouCardI
    title={demoData.title}
    body={demoData.body}
    cover={demoData.cover}
    author={demoData.author}
    showAvatar={boolean("showAvatar", true)}
    renderAvatar={(author) => <div>{author.username}</div>}
    titleLines={3}
    bodyLines={2}
    onClick={() => {
      alert("clicked");
    }}
  />
);
export default Example;
