import React from "react";
import PropTypes from "prop-types";
import Alert from "@feat/feat-ui/lib/alert";

const Example = () => (
  <div>
    <h2>Success</h2>
    <Alert
      type="success"
      message="success tips"
      description="Detailed description and advices about successful copywriting."
    />
    <h2>Info</h2>
    <Alert
      type="info"
      message="info tips"
      description="Detailed description and advices about copywriting."
    />
    <h2>Warning</h2>
    <Alert
      type="warning"
      message="warning tips"
      description="Fail to get what your want."
    />
    <h2>Error</h2>
    <Alert
      type="error"
      message="error tips"
      description="Your account doesn't exist."
    />
  </div>
)

export default Example;
