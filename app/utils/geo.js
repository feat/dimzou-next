import { reverseGeocode as reverseGeocodeRequest } from '@/client/geo';

let promise;
export function getGeoLocation(forceUpdate = false) {
  if (promise && !forceUpdate) {
    return promise;
  }
  promise = new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      const err = new Error('GEO_NOT_SUPPORTED');
      reject(err);
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  return promise;
}

export function getGeoLatLng() {
  return getGeoLocation().then((data) => ({
    lat: data.coords.latitude,
    lng: data.coords.longitude,
  }))
}

export const getCurrentLocation = async () => {
  // getGeoLocation;
  const geoInfo = await getGeoLocation();
  // reverseGeoCode;
  const {
    coords: { latitude: lat, longitude: lng },
  } = geoInfo;
  const { data } = await reverseGeocodeRequest({ lat, lng });
  const mapped = {
    ...data,
  };
  mapped.geo = { lat, lng };
  mapped.address = mapped.address || '';
  return mapped;
}