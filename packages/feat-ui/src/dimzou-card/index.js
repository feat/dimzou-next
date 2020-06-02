import React from "react";
import PropTypes from "prop-types";

const Start = ({ name }) => (
  <div>{name} Start Example</div>
);

Start.propTypes = {
  /** component name */
  name: PropTypes.string.isRequired,
};

export default Start;
