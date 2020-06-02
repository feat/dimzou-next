import React from "react";

import RecordItem from "@feat/feat-ui/lib/record-item";
import Popover from "@feat/feat-ui/lib/popover";
import image from "./image.jpg";

class Example extends React.Component {
  render() {
    return (
      <RecordItem hasPic style={{ backgroundColor: "#f4f4f4" }}>
        <RecordItem.Header>
          <RecordItem.Title>Demo Title</RecordItem.Title>
          <RecordItem.Date>2019-03-12</RecordItem.Date>
        </RecordItem.Header>
        <RecordItem.Content>
          <RecordItem.Desc>Demo Organization</RecordItem.Desc>
        </RecordItem.Content>
        <Popover content={<img src={image} />}>
          <RecordItem.ImagePreview
            style={{
              backgroundImage: `url(${image})`,
            }}
          />
        </Popover>
      </RecordItem>
    );
  }
}

export default Example;
