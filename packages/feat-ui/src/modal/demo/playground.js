import React from "react";
import { action } from "@storybook/addon-actions";
import { boolean, select, text } from "@storybook/addon-knobs";

import Modal from "@feat/feat-ui/lib/modal";
import Button from "@feat/feat-ui/lib/button";

const Example = () => (
  <Modal
    isOpen={boolean("isOpen", true)}
    maskClosable={boolean("maskClosable", true)}
    onOpen={action("modal-open")}
    onClose={action("modal-close")}
  >
    <Modal.Base modifier="md">
      <Modal.Header>
        <Modal.Title>{text("Modal Title", "Custom Modal Title")}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <p>{text("Modal Content", "Custom Modal Content")}</p>
      </Modal.Content>
      <Modal.Footer>
        <Button onClick={action("modal-close-click")}>close</Button>
      </Modal.Footer>
    </Modal.Base>
  </Modal>
);

export default Example;
