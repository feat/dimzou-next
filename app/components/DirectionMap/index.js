import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import L from 'leaflet';

import getRandomId from '@/utils/getRandomId';
import tileProviderMap from '@feat/feat-ui/lib/map/leafletProviderConfig';

import './style.scss';

class DirectionMap extends React.PureComponent {
  domId = getRandomId('DirectionMap');

  state = {
    origin: this.props.origin,
    target: this.props.target,
    targetUser: this.props.targetUser,
  };

  componentDidMount() {
    this.renderMap();
    // this.initInteration();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.origin) {
      if (
        this.props.origin.lat !== prevProps.origin.lat ||
        this.props.origin.lng !== prevProps.origin.lng
      ) {
        this.renderOrigin();
      }
    }
    if (prevProps.targetUser) {
      if (
        this.props.targetUser.lat !== prevProps.targetUser.lat ||
        this.props.targetUser.lng !== prevProps.targetUser.lng
      ) {
        this.renderOrigin();
      }
    }
  }

  componentWillMount() {
    clearInterval(this.timer);
  }

  renderOrigin = () => {
    this.setState({
      origin: this.props.origin,
      targetUser: this.props.targetUser,
    });
    this.renderOriginMarker();
    this.renderTargetUserMarker();
  };

  setData = (data) => {
    // origin and directions;
    if (data.origin) {
      this.state.origin = data.origin;
    }
    if (data.directions) {
      this.state.directions = data.directions;
    }
    if (data.target) {
      this.state.target = data.target;
    }

    if (data.targetUser) {
      this.state.targetUser = data.targetUser;
    }

    this.renderTargetMarker();
    this.renderOriginMarker();
    this.renderTargetUserMarker();
    this.flyToBounds();
    this.renderDirections();
  };

  renderTargetMarker() {
    const { target } = this.state;
    if (!target) {
      this.targetMarker && this.targetMarker.removeFrom(this.map);
      this.targetRadius && this.targetRadius.removeFrom(this.map);
    } else {
      // Radius
      if (!target.radius) {
        this.targetRadius && this.targetRadius.removeFrom(this.map);
      } else if (!target.radius) {
        this.originRadius && this.originRadius.removeFrom(this.map);
      } else if (this.targetRadius) {
        this.targetRadius.setLatLng(target);
        this.targetRadius.setRadius(target.radius);
      } else {
        this.targetRadius = L.circle(target, target.radius, {
          color: 'green',
          fillColor: '#0f3',
          fillOpacity: 0.3,
          weight: 2,
        }).addTo(this.map);
      }

      if (this.targetMarker) {
        this.targetMarker.setLatLng(target);
      } else {
        const targetMarker = L.marker(target, {
          icon: L.divIcon({
            className: 'DirectionMap__marker DirectionMap__marker_endIcon',
            iconSize: [28, 32],
            iconAnchor: [11, 28],
          }),
          draggable: false,
        }).addTo(this.map);
        this.targetMarker = targetMarker;
      }
    }
  }

  renderOriginMarker() {
    const { origin } = this.state;
    if (!origin) {
      this.originMarker && this.originMarker.removeFrom(this.map);
      this.originRadius && this.originRadius.removeFrom(this.map);
    } else {
      // Radius
      if (!origin.radius) {
        this.originRadius && this.originRadius.removeFrom(this.map);
      } else if (this.originRadius) {
        this.originRadius.setLatLng(origin);
        this.originRadius.setRadius(origin.radius);
      } else {
        this.originRadius = L.circle(origin, origin.radius, {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.3,
          weight: 2,
        }).addTo(this.map);
      }
      // marker
      if (this.originMarker) {
        this.originMarker.setLatLng(origin);
      } else {
        const originMarker = L.marker(origin, {
          icon: L.divIcon({
            className: 'DirectionMap__marker DirectionMap__marker_startIcon',
            iconSize: [28, 32],
            iconAnchor: [11, 28],
          }),
          draggable: false,
        }).addTo(this.map);
        this.originMarker = originMarker;
      }
    }
  }

  renderTargetUserMarker() {
    const { targetUser } = this.state;
    if (!targetUser) {
      this.targetUserMarker && this.targetUserMarker.removeFrom(this.map);
      this.targetUserRadius && this.targetUserRadius.removeFrom(this.map);
    } else {
      // Radius
      if (!targetUser.radius) {
        this.targetUserRadius && this.targetUserRadius.removeFrom(this.map);
      } else if (this.targetUserRadius) {
        this.targetUserRadius.setLatLng(targetUser);
        this.targetUserRadius.setRadius(targetUser.radius);
      } else {
        this.targetUserRadius = L.circle(targetUser, targetUser.radius, {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.3,
          weight: 2,
        }).addTo(this.map);
      }
      // marker
      if (this.targetUserMarker) {
        this.targetUserMarker.setLatLng(targetUser);
      } else {
        const targetUserMarker = L.marker(targetUser, {
          icon: L.divIcon({
            className:
              'DirectionMap__marker DirectionMap__marker_targetUserIcon',
            iconSize: [28, 32],
            iconAnchor: [11, 28],
          }),
          draggable: false,
        }).addTo(this.map);
        this.targetUserMarker = targetUserMarker;
      }
    }
  }

  renderDirections() {
    const { directions } = this.state;
    // TOOD clean up polylines
    if (this.directions) {
      this.directions.forEach((line) => {
        line.removeFrom(this.map);
      });
    }
    if (!directions) {
      return;
    }
    this.directions = directions.map((data) => {
      const points = data.polyline
        .split(';')
        .map((point) => point.split(',').map((val) => parseFloat(val)));
      return L.polyline(points, {
        className: `DirectionMap__routine DirectionMap__routine_${data.mode}`,
      }).addTo(this.map);
    });
    // this.map.fitBounds(L.featureGroup(this.directions).getBounds());
  }

  flyToBounds() {
    const elements = [];
    if (this.originMarker) {
      elements.push(this.originMarker);
    }
    if (this.targetMarker) {
      elements.push(this.targetMarker);
    }

    if (elements.length === 1) {
      return;
    }
    const featureGroup = L.featureGroup(elements);
    this.map.flyToBounds(featureGroup.getBounds());
  }

  renderMap() {
    const { provider, target, origin, mapProps, targetUser } = this.props;
    const mapLayer = L.tileLayer(
      tileProviderMap[provider].url,
      Object.assign(
        {
          minZoom: 0,
          maxZoom: 20,
        },
        tileProviderMap[provider].options,
      ),
    );

    const map = L.map(this.domId, {
      ...mapProps,
      center: target || origin || targetUser,
      layers: [mapLayer],
    });

    this.map = map;

    this.renderTargetMarker();
    this.renderOriginMarker();
    this.renderTargetUserMarker();
    this.flyToBounds();
    this.renderDirections();
  }

  render() {
    const { className, style, displayFooterAddress, id, target } = this.props;
    return (
      <div id={id} className="DirectionMap" style={style}>
        <div
          id={this.domId}
          className={classNames('DirectionMap__canvas', className)}
        />
        {displayFooterAddress && (
          <div className="DirectionMap__address">{target.formatted}</div>
        )}
      </div>
    );
  }
}

const pointShape = {
  lat: PropTypes.number,
  lng: PropTypes.number,
  formatted: PropTypes.string,
  radius: PropTypes.number,
};

DirectionMap.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  provider: PropTypes.oneOf(['gaode', 'google']),
  target: PropTypes.shape(pointShape),
  origin: PropTypes.shape(pointShape),
  targetUser: PropTypes.shape(pointShape),
  mapProps: PropTypes.shape({
    zoom: PropTypes.number,
    zoomControl: PropTypes.bool,
    scrollWheelZoom: PropTypes.bool,
  }),
  displayFooterAddress: PropTypes.bool,
};

DirectionMap.defaultProps = {
  mapProps: {
    zoom: 12,
    zoomControl: false,
    scrollWheelZoom: true,
    // maxZoom: 16,
  },
  displayFooterAddress: false,
  provider: 'google',
};

export default DirectionMap;
