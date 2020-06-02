import React from "react";
import Modal from "@feat/feat-ui/lib/modal";
import Placeholder from "@feat/feat-ui/lib/placeholder";
import Button from "@feat/feat-ui/lib/button";

/** Modal 之下拥有5种方法， 包括info，warn， warning，success， message。 */
const Example = () => (
  <div>
    <Button
      onClick={() => {
        Modal.info({
          content: <h3>Demo</h3>,
        });
      }}
    >
      Trigger
    </Button>
  </div>
);

export default Example;
