import createTemplate from "../util/createTemplate";

const Modal = createTemplate({
  Compo: "div",
  baseName: "Modal",
  displayName: "Modal",
  customProps: ["modifier"],
  state: ({ namespace, baseName, modifier }) =>
    modifier ? `${namespace}-${baseName}_${modifier}` : undefined,
});

Modal.Header = createTemplate({
  Compo: "div",
  baseName: "Modal__header",
  displayName: "Modal.Header",
});

Modal.Title = createTemplate({
  Compo: "div",
  baseName: "Modal__title",
  displayName: "Modal.Header",
});

Modal.Content = createTemplate({
  Compo: "div",
  baseName: "Modal__content",
  displayName: "Modal.Content",
});

Modal.Footer = createTemplate({
  Compo: "div",
  baseName: "Modal__footer",
  displayName: "Modal.Footer",
});

export default Modal;
