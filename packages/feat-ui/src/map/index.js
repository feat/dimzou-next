// import React, { Component } from "react";
// import PropTypes from "prop-types";
// import L from "leaflet";
// import tileProviderMap from "./leafletProviderConfig";
//
// function _getRandomId(prefix) {
//   let id = "";
//   do {
//     id = `${prefix}-${(`000000${Math.floor(Math.random() * 100000)}`).substr(-6, 6)}`;
//   } while (document.getElementById(id) !== null);
//   return id;
// }
//
// class Map extends Component {
//   constructor(props) {
//     super(props);
//     this.domId = _getRandomId("ft-Map");
//   }
//   componentDidMount() {
//     const domId = this.domId;
//     const { points, provider, zoom, zoomControl, scrollWheelZoom, autoFit } = this.props;
//
//
//     const mapLayer = L.tileLayer(tileProviderMap[provider].url, Object.assign({
//       minZoom: 0,
//       maxZoom: 23
//     }, tileProviderMap[provider].options));
//
//     const map = L.map(domId, {
//       center: points[0],
//       layers: [mapLayer],
//       zoom,
//       zoomControl,
//       scrollWheelZoom
//     });
//
//     const markers = [];
//
//     points.forEach((point) => {
//       markers.push(L.marker(point, {
//         icon: L.divIcon({
//           className: "ft-Map__marker",
//           iconSize: [26, 42],
//         })
//       }).addTo(map));
//     });
//
//     if (autoFit) {
//       const makerGroup = L.featureGroup(markers);
//       map.flyToBounds(makerGroup.getBounds());
//     }
//
//     this.map = map;
//     this.mapLayer = mapLayer;
//     this.markers = this.markers;
//
//   }
//   render() {
//     return (
//       <div id={this.domId} style={{ height: "300px" }} />
//     );
//   }
// }
//
// Map.propTypes = {
//   provider: PropTypes.oneOf(["gaode", "google", "openStreatMap"]),
//   points: PropTypes.array,
//   zoom: PropTypes.number,
//   zoomControl: PropTypes.bool,
//   scrollWheelZoom: PropTypes.bool
// };
//
// Map.defaultProps = {
//   provider: "google",
//   zoom: 12,
//   zoomControl: true,
//   scrollWheelZoom: true,
//   autoFit: true
// };
//
// export default Map;
