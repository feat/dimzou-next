import React from "react";
import PropTypes from "prop-types";
import Alert from "@feat/feat-ui/lib/alert";

const Example = () => (
  <div>
    <Alert
      closable
      closeText="close"
      message="I got sick because of air pollution."
      description="I might need a doctor!"
      onClose={() => { console.log("now i am closed!"); }}
    />
  </div>
)

export default Example;
