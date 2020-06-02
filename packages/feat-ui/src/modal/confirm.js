import React from "react";
import ReactDOM from "react-dom";
import Modal from "./Modal";
import Temps from "./templates";

import ActionButton from "./ActionButton";

export default function confirm(config) {
  const div = document.createElement("div");
  document.body.appendChild(div);
  let isOpen = true;
  const {
    title,
    content,
    onConfirm,
    onCancel,
    showMask = true,
    maskClosable = false,
    size = "md",
  } = config;

  function destory() {
    setTimeout(() => {
      const unmountResult = ReactDOM.unmountComponentAtNode(div);
      if (unmountResult && div.parentNode) {
        div.parentNode.removeChild(div);
      }
    }, 100);
    // destory later
  }

  function close() {
    isOpen = false;
    renderDOM();
  }

  function renderDOM() {
    ReactDOM.render(
      <Modal
        isOpen={isOpen}
        onClose={destory}
        showMask={showMask}
        maskClosable={maskClosable}
      >
        <Temps modifier={size}>
          {title && (
            <Temps.Header>
              <Temps.Title>{title}</Temps.Title>
            </Temps.Header>
          )}
          <Temps.Content>{content}</Temps.Content>
          <Temps.Footer>
            {onCancel && (
              <ActionButton
                style={{ marginRight: 16 }}
                type="no"
                actionFn={onCancel}
                closeModal={close}
              />
            )}
            <ActionButton type="ok" actionFn={onConfirm} closeModal={close} />
          </Temps.Footer>
        </Temps>
      </Modal>,
      div
    );
  }
  renderDOM();
}
