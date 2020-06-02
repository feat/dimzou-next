import React, { Component } from "react";
import PropTypes from "prop-types";

const req = require.context('../icons', false, /\.svg$/);

const icons = req.keys().map((key) => {
  const iconName = key.replace(/\.\/(.*)\.svg$/, "$1");
  return iconName;
})

export default icons;
