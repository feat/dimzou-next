import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// import classNames from 'classnames';

// import SvgIcon from '@feat/feat-ui/lib/svg-icon';
// import IconButton from '@feat/feat-ui/lib/button/IconButton';
import FtBlock from '@feat/feat-ui/lib/block';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import WeekdayWidget from '@/components/WeekdayWidget';
import intlMessages from './messages';

import './style.scss';

// const early = (a, b) => (a.isBefore(b) ? a : b);
// const late = (a, b) => (a.isAfter(b) ? a : b);

function OpenTimeSection(props) {
  // const { data: records } = props;
  if (props.data.length) {
    // const weekdays = records.reduce(
    //   (days, record) => [...days, ...record.weekdays],
    //   [],
    // );
    // const maxRange = records.reduce((range, record) => {
    //   const recordRange = {
    //     start: moment.utc(record.start).local(),
    //     until: moment.utc(record.until).local(),
    //   };
    //   if (!range) {
    //     return recordRange;
    //   }
    //   return {
    //     start: early(range.start, recordRange.start),
    //     until: late(range.until, recordRange.until),
    //   };
    // }, undefined);
    const opentimes = props.data.reduce((init, current) => {
      if (
        init.length === 0 ||
        init[init.length - 1].weekdays.toString() !==
          current.weekdays.toString()
      ) {
        init.push({
          weekdays: current.weekdays,
          rangeTime: [{ start: current.start, until: current.until }],
        });
      } else if (
        init[init.length - 1].weekdays.toString() ===
        current.weekdays.toString()
      ) {
        init[init.length - 1].rangeTime.push({
          start: current.start,
          until: current.until,
        });
      }
      return init;
    }, []);

    // const renturnRange = (start, until) => {
    //   const Range = {
    //     start: moment.utc(start).local(),
    //     until: moment.utc(until).local(),
    //   };
    //   return Range;
    // };

    // 合并星期数
    const weeks = opentimes
      .map((item) => item.weekdays)
      .reduce((acc, cur) => acc.concat(cur), []);
    // // 设置初始的星期数
    // const [timeIndex, setTimeIndex] = useState(Math.min(...weeks));
    // // 设置初始的大时间段
    // const [weekday, setWeekday] = useState(
    //   opentimes.find((d) => d.weekdays.includes(timeIndex)).weekdays,
    // );

    const returnMinMaxRange = () => {
      const allStart = [];
      const allUntil = [];
      opentimes.forEach((opentime) => {
        opentime.rangeTime.forEach((range) => {
          allStart.push(moment(range.start));
          allUntil.push(moment(range.until));
        });
      });

      return {
        start: moment.min(allStart).local(),
        until: moment.max(allUntil).local(),
      };
    };

    const minMaxRange = returnMinMaxRange();
    return (
      <FtBlock
        title={
          <span className="padding_x_5">
            <TranslatableMessage message={intlMessages.sectionTitle} />
          </span>
        }
        className="ViewOpenTime"
        noPadding
      >
        <div className="padding_t_5">
          <WeekdayWidget selected={weeks} />
          <div className="ViewOpenTime__rangeLabel">
            {`${minMaxRange.start.format(
              'HH:mm',
            )} -- ${minMaxRange.until.format('HH:mm')}`}
          </div>
        </div>

        {/* 多时段显示 */}
        {/* {opentimes.map((time, i) => (
          <div key={i} className="padding_t_5 ViewOpenTime__range">
            <WeekdayWidget selected={time.weekdays} />
            {time.rangeTime.map((range, index) => (
              <div key={index} className="ViewOpenTime__rangeLabel">
                {`${renturnRange(range.start, range.until).start.format(
                  'HH:mm',
                )} -- ${renturnRange(range.start, range.until).until.format(
                  'HH:mm',
                )}`}
              </div>
            ))}
          </div>
        ))} */}

        {/* 整合多时段显示 */}
        {/* <div className="ViewOpenTime__block">
          {[...new Array(7)].map((_, i) => (
            <SvgIcon
              key={i}
              icon={`weekday-${i}`}
              className={classNames('ViewOpenTime__item', {
                'is-selected': weeks && weeks.indexOf(i) > -1,
                'is-show': weekday.includes(i),
              })}
              disabled={weeks && weeks.indexOf(i) === -1}
              onClick={() => {
                setTimeIndex(i);
                setWeekday(
                  opentimes.find((d) => d.weekdays.includes(i)).weekdays,
                );
              }}
            />
          ))}
        </div>
        <div className="ViewOpenTime__range">
          {opentimes.map(
            (item) =>
              item.weekdays.includes(timeIndex) && (
                <>
                  {item.rangeTime.map((range, index) => (
                    <div key={index} className="ViewOpenTime__rangeLabel">
                      {`${renturnRange(range.start, range.until).start.format(
                        'HH:mm',
                      )} -- ${renturnRange(
                        range.start,
                        range.until,
                      ).until.format('HH:mm')}`}
                    </div>
                  ))}
                </>
              ),
          )}
        </div> */}
      </FtBlock>
    );
  }
  return null;
}

OpenTimeSection.propTypes = {
  data: PropTypes.array,
};

export default OpenTimeSection;
