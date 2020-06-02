import React, { Component } from "react";

export default function MobileList(props) {
  return (
    <ul className="ft-MobileList">
      {props.children}
    </ul>
  );
}
