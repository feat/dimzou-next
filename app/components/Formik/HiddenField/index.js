import React from 'react';
// import PropTypes from 'prop-types';

export default function HiddenField({ field, ...custom }) {
  return <input {...field} type="hidden" disabled={custom.disabled} />;
}
