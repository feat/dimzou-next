import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import throttle from 'lodash/throttle';
import { MeasureContext } from '../context';

function MeasureProvider({ measure, children }) {
  const throttled = useCallback(throttle(measure, 100), [measure])
  return (
    <MeasureContext.Provider value={throttled}>
      {children}
    </MeasureContext.Provider>
  )
}

MeasureProvider.propTypes = {
  measure: PropTypes.func,
  children: PropTypes.node,
}

export default MeasureProvider;
