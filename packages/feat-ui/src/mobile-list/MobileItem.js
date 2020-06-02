import React, { Component } from "react";
import classNames from "classnames";

export default function MobileItem(props) {
  const { itemBefore, itemAfter } = props;
  return (
    <li className="ft-MobileItem" >
      { itemBefore && (
        <div className="ft-MobileItem__before">{itemBefore}</div>
      )}
      <div
        className={classNames({
          "ft-MobileItem__content": true,
          "has-before": !!itemBefore,
          "has-after": !!itemAfter,
        })}
      >
        {props.children}
      </div>
      { itemAfter && (
        <div className="ft-MobileItem__after">{itemAfter}</div>
      )}
    </li>
  );
}
