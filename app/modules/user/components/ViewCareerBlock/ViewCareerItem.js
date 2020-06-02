import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import RecordItem from '@feat/feat-ui/lib/record-item';

const getPeriodString = (props) => {
  const begin = moment(props.since).format('YYYY');
  const end = props.working_on ? 'Present' : moment(props.until).format('YYYY');
  return `${begin} -- ${end}`;
};

const ViewCareerItem = (props) => {
  const { position, organization } = props;
  return (
    <RecordItem modifier="dashed" className="ViewEducationItem">
      <RecordItem.Header>
        <RecordItem.Title>{position}</RecordItem.Title>
        <RecordItem.Date>({getPeriodString(props)})</RecordItem.Date>
      </RecordItem.Header>
      <RecordItem.Content>
        <RecordItem.Desc>{organization}</RecordItem.Desc>
      </RecordItem.Content>
    </RecordItem>
  );
};

ViewCareerItem.propTypes = {
  position: PropTypes.string,
  organization: PropTypes.string,
  // description: PropTypes.string,
  // achievement: PropTypes.string,
};

export default ViewCareerItem;
