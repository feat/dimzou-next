import React from "react";

import RecordItem from "@feat/feat-ui/lib/record-item";

class Example extends React.Component {
  render() {
    return (
      <RecordItem modifier="dashed" style={{ backgroundColor: "#f4f4f4" }}>
        <RecordItem.Header>
          <RecordItem.Title>Demo Title</RecordItem.Title>
          <RecordItem.Date>2019-03-12</RecordItem.Date>
        </RecordItem.Header>
        <RecordItem.Content>
          <RecordItem.Desc>Demo Organization</RecordItem.Desc>
        </RecordItem.Content>
      </RecordItem>
    );
  }
}

export default Example;
