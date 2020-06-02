import React from "react";
import PropTypes from "prop-types";
import Button from "@feat/feat-ui/lib/button";
import notification from "@feat/feat-ui/lib/notification";

/** 使用 style 和 className 来定义样式。 */
const openNotification = () => {
  notification.open({
    message: "Notification Title",
    description: "This is the content of the notification. This is the content of the notification. This is the content of the notification.",
    style: {
      width: 600,
      marginLeft: 335 - 600,
    },
  });
};

export default function Custom() {
  return <Button onClick={openNotification}>custom style</Button>;
}
