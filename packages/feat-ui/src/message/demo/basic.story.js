import React from "react";
import message from "@feat/feat-ui/lib/message";
import Button from "@feat/feat-ui/lib/button";


const createMessage = (type) => () => {
  const config = {
    content: `${type} type of message!`,
    duration: 2,
    onClose: () => { console.log(`${type} type of message is closed!`); },
  };
  message[type](config);
};

const neverAutoClose = () => {
  const config = {
    content: "never close automatically!",
    duration: null,
  };
  message.info(config);
};


/** 全局提示信息, 拥有5种样式，包括success，error，info，warning， warn，loading。 */
const Example = () => (
  <div>
    <h3>different types</h3>
    <Button onClick={createMessage("success")}>success</Button>
    <Button onClick={createMessage("warning")}>warning</Button>
    <Button onClick={createMessage("warn")}>warn</Button>
    <Button onClick={createMessage("info")}>info</Button>
    <Button onClick={createMessage("loading")}>loading</Button>
    <h3>async</h3>
    <Button onClick={neverAutoClose}>Buy SomeThing</Button>
  </div>
);

export default Example;
