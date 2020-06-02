import React from "react";
import PropTypes from "prop-types";
import Button from "@feat/feat-ui/lib/button";
import notification from "@feat/feat-ui/lib/notification";

const close = () => {
  console.log(
    "Notification was closed. Either the close button was clicked or duration time elapsed."
  );
};
/** 自定义关闭按钮的样式和文字。 */
const openNotification = () => {
  const key = `open${Date.now()}`;
  const btnClick = function() {
    // to hide notification box
    notification.close(key);
  };
  const btn = (
    <Button type="primary" size="sm" onClick={btnClick}>
      Confirm
    </Button>
  );
  notification.open({
    message: "Notification Title",
    description:
      'A function will be be called after the notification is closed (automatically after the "duration" time of manually).',
    btn,
    key,
    onClose: close,
    duration: 0,
  });
};

export default function WithBtn() {
  return (
    <Button type="primary" onClick={openNotification}>
      Open the notification box
    </Button>
  );
}
