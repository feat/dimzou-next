import React from "react";
import Modal from "@feat/feat-ui/lib/modal";
import { RectShape } from "@feat/feat-ui/lib/placeholder";
import Button from "@feat/feat-ui/lib/button";

/** Modal 配合预设模版自定义内容。 */
class Example extends React.Component {
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
        <Button onClick={() => this.setState({ date: Date.now() })}>
          Rerender
        </Button>
        <Modal
          isOpen={this.state.isOpen}
          onClose={() => {
            console.log("onClose");
            this.setState({ isOpen: false });
          }}
          onOpen={() => {
            console.log("onOpen");
          }}
          maskClosable
        >
          <Modal.Base>
            <Modal.Header>
              <Modal.Title>Custom Modal with Template</Modal.Title>
            </Modal.Header>
            <Modal.Content>
              <h3>Custom Content goes here.</h3>
              <RectShape ratio={16 / 9} label="Modal Content" />
            </Modal.Content>
            <Modal.Footer>
              <Button onClick={this.closeModal}>close</Button>
            </Modal.Footer>
          </Modal.Base>
        </Modal>
      </div>
    );
  }
}

export default Example;
