import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import TextRow from "./TextRow";

export default function TextBlockPlaceholder({ row }) {
  return (
    <div className="ft-Placeholder ft-Placeholder_textBlock">
      {Array(...Array(row)).map((a, index) => <TextRow key={index} />)}
    </div>
  );
}

TextBlockPlaceholder.propTypes = {
  row: PropTypes.number,
};
