import React from "react";
import { boolean } from "@storybook/addon-knobs";
import DimzouCardI from "../DimzouCardI";
import demoData from "./demoData";
/** DimzouCard - Draft */
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
    isTranslation
  />
);
export default Example;
