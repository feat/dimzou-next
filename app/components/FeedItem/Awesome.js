import React from 'react';
import PropTypes from 'prop-types';

import { formatTimezone } from '@/utils/time';
import { openRangeTime } from '@/utils/awesome';

import Clamp from '@feat/feat-ui/lib/clamp';

import AvatarStamp from '@/containers/AvatarStamp';
import LiveClock from '@/components/LiveClock';
import WeekdayWidget from '@/components/WeekdayWidget';
import StaticMap from '@/components/StaticMap';

import Card from './Card';

import './style.scss';

const AwesomeCard = (props) => {
  const {
    weekdays,
    job_title: jobTitle,
    author,
    open_range_start: openRangeStart,
    open_range_end: openRangeEnd,
    // nightTheme,
    onClick,
    className,
    workplace,
  } = props;

  let renderTitle = '';
  if (props.title) {
    renderTitle = props.title.trim();
  }
  if (props.expertise && props.expertise[0]) {
    renderTitle = props.expertise[0].name;
  }

  return (
    <Card modifier="awesome" className={className} onClick={onClick}>
      <Card.Title>
        <Clamp lines={2} ellipsis>
          {renderTitle}
        </Clamp>
      </Card.Title>
      <Card.Content>
        <div className="ft-HomeCard__openInfo">
          <WeekdayWidget selected={weekdays} />
          {openRangeStart &&
            openRangeEnd &&
            openRangeTime(openRangeStart, openRangeEnd)}
        </div>
        <div className="padding_y_5">
          <AvatarStamp
            uid={author.uid}
            avatar={author.avatar}
            username={author.username}
            jobTitle={jobTitle}
            location={author.location}
            localTime={
              <LiveClock
                timezone={formatTimezone(author.timezone_utc_offset)}
              />
            }
            uiMeta={['jobTitle']}
            uiExtraMeta={['location', 'localTime']}
            online={author.online}
            size="xs"
          />
        </div>
        {workplace &&
          workplace.lat && (
          <StaticMap style={{ flex: 1 }} minHeight={100} data={workplace} />
        )}
      </Card.Content>
    </Card>
  );
};

AwesomeCard.propTypes = {
  title: PropTypes.string,
  // content: PropTypes.string,
  expertise: PropTypes.array,
  weekdays: PropTypes.array,
  job_title: PropTypes.string,
  author: PropTypes.object,
  open_range_start: PropTypes.string,
  open_range_end: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  workplace: PropTypes.object,
};

export default AwesomeCard;
