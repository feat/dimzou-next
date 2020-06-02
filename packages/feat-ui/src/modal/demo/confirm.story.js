import React from "react";
import Modal from "@feat/feat-ui/lib/modal";
import Placeholder from "@feat/feat-ui/lib/placeholder";
import Button from "@feat/feat-ui/lib/button";

/** Modal 之下拥有5种方法， 包括info，warn， warning，success， message。 */
const Example = () => (
  <div>
    <Button
      type="danger"
      onClick={() => {
        Modal.confirm({
          title: "Confirm",
          content: "Are you sure to Dismiss Group?",
          showMask: false,
          onCancel: () => {
            console.log("handle Cancel");
          },
          onConfirm: () => {
            console.log("handle confirm");
          },
        });
      }}
    >
      Delete
    </Button>
  </div>
);

export default Example;
