export function getSpotImageUrl(location, options = {}) {
  const { lat, lng } = location;
  const width = parseInt(options.width, 10) || 640;
  const height = parseInt(options.height, 10) || 360;
  const query = {
    center: `${lat},${lng}`,
    zoom: options.zoom || 14,
    markers: `color:${options.markerColor||'red'}|${lat},${lng}`,
    size: `${width}x${height}`,
    scale: options.scale || 2,
  }
  const search = Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&');
  
  return `/api/geo/googleapis-staticmap/?${search}`

}