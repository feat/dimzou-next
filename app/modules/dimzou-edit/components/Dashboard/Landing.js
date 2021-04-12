import PropTypes from 'prop-types';

import ReaderReport from './ReaderReport';
import LatestComments from './LatestComments';
import ReaderTaste from './ReaderTaste';
import BasicStatistics from './BasicStatistics';
import ResourceReport from './ResourceReport';

function Landing(props) {
  return (
    <div className="dz-Dashboard">
      <BasicStatistics />
      <LatestComments />
      <ReaderReport />
      <ResourceReport />
      <ReaderTaste userId={props.userId} />
    </div>
  );
}

Landing.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
export default Landing;
