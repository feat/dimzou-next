/**
 *
 * Loading
 *
 */

import React from 'react';
import Loader from '@feat/feat-ui/lib/loader';

export default function Loading(props) {
  return (
    <div className="relative" {...props}>
      <Loader size="lg" />
    </div>
  );
}

Loading.defaultProps = {
  style: {
    height: '100vh',
  },
};
