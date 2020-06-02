import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default function FormHelp({ data, className, style, validateStatus }) {
  const helpClassName = {
    "ft-FormHelp": true,
    [className]: className,
    "t-danger": validateStatus === "error",
    "t-success": validateStatus === "success",
    "t-warning": validateStatus === "warning",
  };

  if (!data) {
    return null;
  }

  if (typeof data === "string") {
    return (
      <ul className="ft-FormHelpList">
        <li className={classNames(helpClassName)}>{data}</li>
      </ul>
    );
  }
  if (data instanceof Array) {
    return (
      <ul className="ft-FormHelpList">
        { data.map((message, index) => (<li className={classNames(helpClassName)} key={index}>{ message }</li>))}
      </ul>
    );
  }
  return (
    <ul className="ft-FormHelpList">
      { Object.keys(data).map((key) => (
        <li className={classNames(helpClassName)} key={key}>{`${key}: ${data[key]}`}</li>
      ))}
    </ul>
  );
}

FormHelp.propTypes = {
  data: PropTypes.any,
};
