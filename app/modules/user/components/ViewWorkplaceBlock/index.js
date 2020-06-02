import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { fetchDirection as fetchDirectionRequest } from '@/client/geo';

import { getGeoLocation } from '@/utils/geo';

import Block from '@feat/feat-ui/lib/block';
import Button from '@feat/feat-ui/lib/button';
import MaskLoader from '@feat/feat-ui/lib/loader/MaskLoader';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import DirectionMap from '@/components/DirectionMap';
import directionMessages from '@/components/DirectionMap/messages';
import intlMessages from './messages';
import drivingIcon from './icons/driving.svg';
import transitIcon from './icons/transit.svg';
import walkingIcon from './icons/walking.svg';

import './style.scss';

const modes = ['driving', 'transit', 'walking'];
const icons = {
  driving: drivingIcon,
  transit: transitIcon,
  walking: walkingIcon,
};

const getMinutes = (duration) => Math.ceil(duration / 60);

class WorkplaceSection extends React.PureComponent {
  state = {
    origin: null,
    selectedDirections: [],
  };

  componentDidMount() {
    this.getLocationDirections();
  }

  getLocationDirections() {
    this.setState({
      isGettingLocation: true,
    });
    getGeoLocation()
      .then((data) => {
        const origin = {
          lat: data.coords.latitude,
          lng: data.coords.longitude,
        };
        this.setState(
          {
            origin,
          },
          this.updateMap,
        );
        this.fetchDirections(origin);
      })
      .catch((err) => {
        this.setState({
          originError: err,
        });
      })
      .finally(() => {
        this.setState({
          isGettingLocation: false,
        });
      });
  }

  fetchDirections = (origin) => {
    this.fetchDirection(origin, 'driving');
    this.fetchDirection(origin, 'walking');
    this.fetchDirection(origin, 'transit');
  };

  fetchDirection(origin, mode) {
    const { data } = this.props;
    this.setState({
      [`${mode}DirectionFetching`]: true,
    });
    fetchDirectionRequest({
      destination: `${data.lat},${data.lng}`,
      origin: `${origin.lat},${origin.lng}`,
      mode,
    })
      .then((res) => {
        this.setState(
          {
            [`${mode}Direction`]: res.routes[0],
          },
          this.updateMap,
        );
      })
      .finally(() => {
        this.setState({
          [`${mode}DirectionFetching`]: false,
          [`${mode}DirectionFetched`]: true,
        });
      });
  }

  toggleSelected = (mode) => {
    const { selectedDirections } = this.state;
    if (selectedDirections[0] === mode) {
      this.setState(
        {
          selectedDirections: [],
        },
        this.updateMap,
      );
    } else {
      this.setState(
        {
          selectedDirections: [mode],
        },
        this.updateMap,
      );
    }

    // if (selectedDirections.indexOf(mode) > -1) {
    //   this.setState(
    //     {
    //       selectedDirections: selectedDirections.filter((item) => item !== mode),
    //     },
    //     this.updateMap,
    //   );
    // } else {
    //   this.setState(
    //     {
    //       selectedDirections: [...selectedDirections, mode],
    //     },
    //     this.updateMap,
    //   );
    // }
  };

  updateMap = () => {
    const data = {
      origin: this.state.origin,
      target: this.props.data,
    };
    const selectedDirections = this.state.selectedDirections.length
      ? this.state.selectedDirections
      : modes;

    const directions = [];
    selectedDirections.forEach((mode) => {
      const direction = this.state[`${mode}Direction`];
      if (direction) {
        directions.push({
          mode,
          polyline: direction.overviewPolyline,
        });
      }
    });

    data.directions = directions;
    this.directionMap.setData(data);
  };

  renderActions() {
    if (this.state.isGettingLocation) {
      return (
        <div className="ViewUserWorkplace__actionOverlay">
          <MaskLoader />
        </div>
      );
    }
    return (
      <div className="ViewUserWorkplace__actionOverlay">
        {modes.map((mode) => this.renderModeButton(mode))}
      </div>
    );
  }

  renderModeButton(mode) {
    const { selectedDirections } = this.state;
    const direction = this.state[`${mode}Direction`];
    const fetching = this.state[`${mode}DirectionFetching`];
    const fetched = this.state[`${mode}DirectionFetched`];
    const className = classNames(`DirectionItem DirectionItem_${mode}`, {
      'is-selected': selectedDirections.indexOf(mode) > -1,
    });

    return (
      <div key={mode} className="ViewUserWorkplace__modeBtn">
        <Button
          type="merge"
          className={className}
          key={mode}
          disabled={fetching || (fetched && !direction)}
          onClick={() => this.toggleSelected(mode)}
        >
          <div
            className="DirectionItem__icon"
            dangerouslySetInnerHTML={{ __html: icons[mode] }}
          />
          <div className="DirectionItem__label">
            <TranslatableMessage message={directionMessages[`${mode}Label`]} />
          </div>
          <div className="DirectionItem__duration">
            {(fetching || (fetched && !direction)) && '--'}
            {!fetching &&
              fetched &&
              direction && (
              <TranslatableMessage
                message={directionMessages.duration}
                values={{
                  minute: getMinutes(direction.duration),
                }}
              />
            )}
          </div>
          {fetching && <MaskLoader />}
        </Button>
      </div>
    );
  }

  render() {
    const { data: workplace } = this.props;

    return (
      <Block
        className="ViewUserWorkplace"
        title={<TranslatableMessage message={intlMessages.sectionTitle} />}
        subHeader={<span className="pull-right">{workplace.formatted}</span>}
      >
        <div className="ViewUserWorkplace__mapContainer">
          <DirectionMap
            ref={(n) => {
              this.directionMap = n;
            }}
            target={workplace}
            provider={workplace.country_code === 'CHN' ? 'gaode' : 'google'}
          />
        </div>
        {this.renderActions()}
      </Block>
    );
  }
}

WorkplaceSection.propTypes = {
  data: PropTypes.object,
};

export default WorkplaceSection;
