import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

function upperFirst(str) {
  const arr = str.toLowerCase().split(" ").map((sub, i) => {
    if (i === 0) return sub;
    return sub.substring(0, 1).toUpperCase() + sub.substring(1);
  });
  return arr.join("");
}

export default function Flag(props) {
  const { country, className, ...rest } = props;
  const cls = cx("ft-Flag", `ft-Flag_${upperFirst(country)}`, className);
  return <i className={cls} {...rest} />;
}

Flag.propTypes = {
  country: PropTypes.string.isRequired,
};
