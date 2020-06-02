import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);
/* eslint-disable */
export function flatenOpenPeriods(openTimes) {
  const openPeriods = openTimes.reduce((a, b) => {
    b.weekday.forEach((day) => {
      b.periods.forEach((period) => {
        const start = moment(period.start);
        const end = moment(period.end);
        if (end.day() > start.day()) {
          a[day] = a[day] || [];
          a[day].push({
            start,
            end: moment(start).endOf('day'), // maybe use start of next day
          });
          a[day + 1] = a[day + 1] || [];
          a[day + 1].push({
            start: moment(end).startOf('day'),
            end,
          });
        } else {
          a[day] = a[day] || [];
          a[day].push({
            start,
            end,
          });
        }
      });
      // a[day] = b.periods;
    });
    return a;
  }, {});
  return openPeriods;
}
/* eslint-enable */

function subtract(periods, range) {
  return periods.reduce((a, b) => {
    if (b.contains(range.start)) {
      const subtracted = b.subtract(range);
      if (subtracted[0] === null) {
        return a;
      }
      return [...a, ...subtracted];
    }
    return [...a, b];
  }, []);
}

function periodsSubtract(basePeriods, childPeriods = []) {
  if (!childPeriods.length) {
    return basePeriods;
  }
  const subtractedBase = subtract(basePeriods, childPeriods[0]);
  return periodsSubtract(subtractedBase, childPeriods.slice(1));
}

export function getSubtracted(m, periods, takenRanges = []) {
  const dayRanges = periods.map((period) => {
    const start = moment(period.start);
    const end = moment(period.end);
    return moment.range(
      moment(m)
        .set('hour', start.hour())
        .set('minute', start.minute()),
      moment(m)
        .set('hour', end.hour())
        .set('minute', end.minute()),
    );
  });

  return periodsSubtract(dayRanges, takenRanges);
}

export function groupTakenPeriods(periods) {
  const takenDays = {};
  periods.forEach((item) => {
    const start = moment(item.start);
    const end = moment(item.end);
    const startDate = start.format('YYYY_MM_DD');
    const endDate = end.format('YYYY_MM_DD');
    if (startDate === endDate) {
      takenDays[startDate] = takenDays[startDate] || [];
      takenDays[startDate].push(moment.range(start, end));
    } else {
      takenDays[startDate] = takenDays[startDate] || [];
      // maybe use start of next day
      takenDays[startDate].push(moment.range(start, start.endOf('day')));
      takenDays[endDate] = takenDays[endDate] || [];
      takenDays[startDate].push(moment.range(end.startOf('day'), end));
    }
  });
  return takenDays;
}

// export function getOpenPeriods(range, openTimeSettings, takenPeriods) {
//   const days = range.by('days');
//   const openPeriods = flatenOpenPeriods(openTimeSettings);
//   const takenDays = groupTakenPeriods(takenPeriods);
//   const availableDays = {};

//   for (const m of days) {
//     const day = m.day();
//     if (openPeriods[day]) {
//       const key = m.format('YYYY_MM_DD');
//       const dayRanges = getSubtracted(m, openPeriods[day], takenDays[key]);
//       if (dayRanges.length) {
//         availableDays[key] = dayRanges;
//       }
//     }
//   }
//   return availableDays;
// }

export function isDayAvailable(date, dayRanges, duration, unit = 'minutes') {
  return Boolean(
    dayRanges && dayRanges.some((range) => range.diff(unit) >= duration),
  );
}

export function isHourAvailable(date, dayRanges, duration, unit = 'minutes') {
  return Boolean(
    dayRanges &&
      dayRanges.some(
        (range) =>
          range.contains(date) &&
          moment.range(moment(date).startOf('minute'), range.end).diff(unit) >=
            duration,
      ),
  );
}

export function isDateAvailable(date, dayRanges, duration, unit = 'minutes') {
  return Boolean(
    dayRanges &&
      dayRanges.some(
        (range) =>
          range.contains(date) &&
          moment.range(date, range.end).diff(unit) >= duration,
      ),
  );
}

const getValue = (str) => parseInt(str.replace(':', ''), 10);

export function getOpenRange(data) {
  if (!data) {
    return '';
  }
  const { open_time: openTime } = data;
  if (!openTime) {
    return '';
  }
  const sinceArr = openTime.reduce(
    (a, b) => [...a, ...b.periods.map((period) => period.start_time)],
    [],
  );
  const untilArr = openTime.reduce(
    (a, b) => [...a, ...b.periods.map((period) => period.end_time)],
    [],
  );
  const firstSince = sinceArr.sort((a, b) => getValue(a) - getValue(b))[0];
  const lastUntil = untilArr.sort((a, b) => getValue(b) - getValue(a))[0];
  return `${firstSince} -- ${lastUntil}`;
}

export function getOpenDays(data) {
  if (!data) {
    return [];
  }
  const { open_time: openTime } = data;
  if (!openTime) {
    return [];
  }
  const days = openTime.reduce((a, b) => [...a, ...b.weekday], []);
  return days;
}
