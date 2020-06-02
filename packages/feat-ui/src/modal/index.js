import Modal from "./Modal";
import Temps from "./templates";
import confirm from "./confirm";

Modal.Base = Temps;
Modal.Header = Temps.Header;
Modal.Title = Temps.Title;
Modal.Content = Temps.Content;
Modal.Footer = Temps.Footer;

Modal.info = function (props) {
  const config = Object.assign({}, {
    type: "info",
    iconType: "info-circle",
  }, props);
  return confirm(config);
};

Modal.success = function (props) {
  const config = Object.assign({}, {
    type: "success",
    iconType: "check-circle",
  }, props);
  return confirm(config);
};

Modal.error = function (props) {
  const config = Object.assign({}, {
    type: "error",
    iconType: "cross-circle",
  }, props);
  return confirm(config);
};

Modal.warning = Modal.warn = function (props) {
  const config = Object.assign({}, {
    type: "warning",
    iconType: "exclamation-circle",
  }, props);
  return confirm(config);
};

Modal.confirm = function (props) {
  const config = Object.assign({}, {
    type: "confirm",
  }, props);
  return confirm(config);
};

export default Modal;
