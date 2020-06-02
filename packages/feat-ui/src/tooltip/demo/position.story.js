import React from "react";
import PropTypes from "prop-types";
import Tooltip from "@feat/feat-ui/lib/tooltip";



const text = "text";

const linkStyle = {
  display: "inline-block",
  lineHeight: "1em",
  width: 60,
  fontSize: 14,
  textAlign: "center",
  background: "#f5f5f5",
  marginRight: "1em",
  marginBottom: "1em",
  borderRadius: 6,
};


function MyTip(props) {
  const { children, ...rest } = props;
  return (<a href="#" style={linkStyle} {...rest}>{children}</a>);
}

const Example = () => (
  <div style={{ padding: 60 }}>
    <div style={{ marginLeft: 60 }}>
      <Tooltip placement="topLeft" title={text}>
        <MyTip>TL</MyTip>
      </Tooltip>
      <Tooltip placement="top" title={text}>
        <MyTip>Top</MyTip>
      </Tooltip>
      <Tooltip placement="topRight" title={text}>
        <MyTip>TR</MyTip>
      </Tooltip>
    </div>
    <div style={{ width: 60, float: "left" }}>
      <Tooltip placement="leftTop" title={text}>
        <MyTip>LT</MyTip>
      </Tooltip>
      <Tooltip placement="left" title={text}>
        <MyTip>Left</MyTip>
      </Tooltip>
      <Tooltip placement="leftBottom" title={text}>
        <MyTip>LB</MyTip>
      </Tooltip>
    </div>
    <div style={{ width: 60, marginLeft: 270 }}>
      <Tooltip placement="rightTop" title={text}>
        <MyTip>RT</MyTip>
      </Tooltip>
      <Tooltip placement="right" title={text}>
        <MyTip>Right</MyTip>
      </Tooltip>
      <Tooltip placement="rightBottom" title={text}>
        <MyTip>RB</MyTip>
      </Tooltip>
    </div>
    <div style={{ marginLeft: 60, clear: "both" }}>
      <Tooltip placement="bottomLeft" title={text}>
        <MyTip>BL</MyTip>
      </Tooltip>
      <Tooltip placement="bottom" title={text}>
        <MyTip>Bottom</MyTip>
      </Tooltip>
      <Tooltip placement="bottomRight" title={text}>
        <MyTip>BR</MyTip>
      </Tooltip>
    </div>
  </div>
)

export default Example;
