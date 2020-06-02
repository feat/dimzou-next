import React from 'react';
import PropTypes from 'prop-types';

import ReaderReport from './ReaderReport';
import DimzouReports from './DimzouReports';
import LatestComments from './LatestComments';
import ReaderTaste from './ReaderTaste';
import './style.scss';

function Dashboard(props) {
  return (
    <div className='dz-Dashboard'>
      <div className="dz-Dashboard__col1">
        <ReaderReport />
      </div>
      <div className="dz-Dashboard__col2">
        <DimzouReports />
        <ReaderTaste userId={props.userId} />
      </div>
      <div className="dz-Dashboard__col3">
        <LatestComments />       
      </div>
    </div>
  )
}

Dashboard.propTypes = {
  userId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
}

export default Dashboard;