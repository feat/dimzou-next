import React from "react";
import classNames from "classnames";

export default function SelectOption(option, meta) {
  return (
    <div
      className={classNames("ft-ButtonSelectOption", {
        "is-selected": meta.isSelected,
        "is-focused": meta.isFocused,
      })}
    >
      {option.label}
    </div>
  );
}
