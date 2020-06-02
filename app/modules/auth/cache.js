let cacheInfo = {
  country: null,
  phone: '',
};
let initType = '';
let isDirty = false;
const cache = {
  update: (data) => {
    if (!isDirty) {
      if (data.phone !== cacheInfo.phone || data.country !== cacheInfo.country) {
        isDirty = true;
      }
    }
    cacheInfo = data;
  },
  getData: () => cacheInfo,
  getInitType: () => initType,
  initWithRegionDefault: (data) => {
    cacheInfo = data;
    initType = 'region_default';
  },
  initWithLastLogined: (data) => {
    cacheInfo = data;
    initType = 'last_logined';
  },
  isDirty: () => isDirty,
}

export default cache;