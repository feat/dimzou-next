export function getFormattedAddress(data) {
  if (data.formatted) {
    return data.formatted;
  }
  const compos = [
    data.level_1,
    data.level_2,
    data.level_3,
    data.level_4,
    data.level_5,
    data.address,
    data.name,
  ].filter((item) => !!item);

  if (data.country_code === 'CHN' || data.country_code === 'CN') {
    return compos.join(' ');
  }
  return compos.reverse().join(' ');
}
