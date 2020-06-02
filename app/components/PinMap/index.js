import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import L from 'leaflet';

import getRandomId from '@/utils/getRandomId';
import tileProviderMap from '@feat/feat-ui/lib/map/leafletProviderConfig';

import './style.scss';

class PinMap extends React.PureComponent {
  constructor(props) {
    super(props);
    this.domId = getRandomId('PinMap');
    this.state = {};
  }

  componentDidMount() {
    this.renderMap();
  }

  componentDidUpdate() {
    if (!this.state.latlng) {
      // sync initial value;
      this.syncMarkerPlace();
    }
  }

  syncMarkerPlace() {
    if (this.props.initialValue) {
      const point = L.latLng(this.props.initialValue);
      this.marker.setLatLng(point);
      if (this.map.getZoom() < 14) {
        this.map.setZoom(14);
      }
      this.map.panTo(point);
    }
  }

  handleMarkerDragEnd = () => {
    const latlng = this.marker.getLatLng();
    this.setState({
      latlng,
    });
    this.props.onChange(latlng);
  };

  renderMap() {
    const { boundsInfo, initialValue } = this.props;
    const domId = this.domId;
    let provider;
    if (this.props.provider) {
      provider = this.props.provider;
    } else if (initialValue) {
      provider = initialValue.country_code === 'CHN' ? 'gaode' : 'google';
    } else {
      provider = 'google';
    }

    const mapLayer = L.tileLayer(
      tileProviderMap[provider].url,
      Object.assign(
        {
          minZoom: 0,
          maxZoom: 23,
        },
        tileProviderMap[provider].options,
      ),
    );

    let center;
    let bounds;
    if (boundsInfo) {
      const corner1 = L.latLng(boundsInfo.north, boundsInfo.west);
      const corner2 = L.latLng(boundsInfo.south, boundsInfo.east);
      bounds = L.latLngBounds(corner1, corner2);
    }
    if (initialValue) {
      center = L.latLng(initialValue);
    } else {
      center = bounds.getCenter();
    }

    const map = L.map(domId, {
      center,
      layers: [mapLayer],
      zoomControl: this.props.zoomControl,
      scrollWheelZoom: this.props.scrollWheelZoom,
      zoom: this.props.zoom,
    });

    const marker = L.marker(center, {
      icon: L.divIcon({
        className: 'PinMap__marker',
        iconSize: [28, 32],
        iconAnchor: [11, 16],
        // iconSize: [20, 33],
      }),
      draggable: true,
    }).addTo(map);

    marker.on('dragend', this.handleMarkerDragEnd);

    if (bounds && !initialValue) {
      map.fitBounds(bounds);
    }

    this.map = map;
    this.marker = marker;
  }

  render() {
    return (
      <div className={classNames('PinMap', this.props.className)}>
        <div className="PinMap__canvas" id={this.domId} />
      </div>
    );
  }
}

PinMap.propTypes = {
  initialValue: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  boundsInfo: PropTypes.shape({
    west: PropTypes.number,
    north: PropTypes.number,
    south: PropTypes.number,
    east: PropTypes.number,
  }),
  className: PropTypes.string,
  provider: PropTypes.string,
  zoomControl: PropTypes.bool,
  zoom: PropTypes.number,
  scrollWheelZoom: PropTypes.bool,
  onChange: PropTypes.func,
};

PinMap.defaultProps = {
  zoomControl: true,
  scrollWheelZoom: true,
  zoom: 14,
};

export default PinMap;
