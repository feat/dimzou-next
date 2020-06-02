import React from "react";
import Modal from "@feat/feat-ui/lib/modal";
import { RectShape } from "@feat/feat-ui/lib/placeholder";
import Button from "@feat/feat-ui/lib/button";

/** Modal 基本使用。 */
export default class Example extends React.Component {
  state = { isOpen: false };

  openModal = () => {
    this.setState({ isOpen: true });
  };

  closeModal = () => {
    this.setState({ isOpen: false });
  };

  render() {
    return (
      <div>
        <Button onClick={this.openModal}>open modal!</Button>
        <Modal
          isOpen={this.state.isOpen}
          onClose={this.closeModal}
          maskClosable
        >
          <RectShape width={300} height={300} label="Modal" />
        </Modal>
      </div>
    );
  }
}
