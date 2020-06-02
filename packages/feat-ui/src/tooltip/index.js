import React from "react";
import Tooltip from "./Tooltip";

class FtTooltip extends React.Component {
  render(){
    const { title, children, ...rest } = this.props;
    return (
      <Tooltip {...rest} overlay={title}>
        {children}
      </Tooltip>
    )
  }
}

export default FtTooltip;
