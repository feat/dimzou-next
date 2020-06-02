import React from "react";
import PropTypes from "prop-types";
import Button from "@feat/feat-ui/lib/button";
import notification from "@feat/feat-ui/lib/notification";

/** 最简单的用法，4.5 秒后自动关闭。 */
const openNotification = () => {
  notification.open({
    message: "Notification Title",
    description: "This is the content of the notification. This is the content of the notification. This is the content of the notification.",
  });
};

export default function Basic() {
  return (
    <Button
      type="primary"
      onClick={openNotification}
    >Open the notification box</Button>
  );
}
