import { DateTime } from 'luxon';

let locale;
try {
  const localeData = localStorage.getItem('_locale');
  locale = JSON.parse(localeData).locale || 'en'; // eslint-disable-line
} catch (err) {
  locale = 'en';
}

export function formatTimezone(utcOffset) {
  if (!utcOffset) {
    return 'UTC';
  }
  const prefix = utcOffset.substr(0, 1);
  const offsetStr = utcOffset.slice(1);
  const offsetValue = parseInt(offsetStr.split(':')[0], 10);
  return `UTC${prefix}${offsetValue}`;
}

export function formatDate(date, format = 'yyyy MM dd HH:mm:ss') {
  return DateTime.fromISO(date, { zone: 'utc' })
    .toLocal()
    .setLocale(locale)
    .toFormat(format);
}

export function minFormatDate(date, format = 'yy MM dd HH:mm') {
  return DateTime.fromISO(date, { zone: 'utc' })
    .toLocal()
    .setLocale(locale)
    .toFormat(format);
}

export function localTimeForTimezone(timezone, format = 'HH:mm') {
  return DateTime.local()
    .setZone(timezone)
    .toFormat(format);
}

export function isDayTime(timezone) {
  const localTime = DateTime.local().setZone(timezone);
  return localTime.hour > 6 && localTime.hour < 18;
}
