import moment from 'moment';
import { formatDate } from './time';

export const openRangeTime = (timeStart, timeEnd) => {
  const tStart = formatDate(timeStart, 'HH:mm');
  const tEnd = formatDate(timeEnd, 'HH:mm');
  return `${tStart} - ${tEnd}`;
};

export const localTimes = (timezone) => {
  if (timezone) {
    const offsetValue = parseInt(timezone.split(':')[0], 10);
    const time = moment().utcOffset(offsetValue);
    return time;
  }
  return moment();
};
