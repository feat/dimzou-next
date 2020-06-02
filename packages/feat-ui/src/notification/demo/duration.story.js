import React from "react";
import PropTypes from "prop-types";

import Button from "@feat/feat-ui/lib/button";
import notification from "@feat/feat-ui/lib/notification";

// 自定义通知框自动关闭的延时，默认`4.5s`，取消自动关闭只要将该值设为 `0` 即可。
const openNotification = () => {
  const args = {
    message: "Notification Title",
    description: "I will never close automatically. I will be close automatically. I will never close automatically.",
    duration: 0,
  };
  notification.open(args);
};

export default function Custom() {
  return <Button onClick={openNotification}>custom style</Button>;
}
