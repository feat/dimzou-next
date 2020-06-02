import React from 'react';
import PropTypes from 'prop-types';

import WeekdayWidget from '@/components/WeekdayWidget';
import staticMap from '@/components/StaticMap';
import AvatarStamp from '@/containers/AvatarStamp';

import Card from './Card';

class ExpertiseItem extends React.PureComponent {
  static propTypes = {
    workplace: PropTypes.object,
    name: PropTypes.string,
    user: PropTypes.number,
    on_site_price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    online_price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    workplace_price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    open_time: PropTypes.object,
    dispatch: PropTypes.func,
  };

  componentDidMount() {
    setTimeout(this.tryToRenderMap, 1000);
  }

  tryToRenderMap = () => {
    const { mapContainer } = this;
    if (!mapContainer) {
      return;
    }
    const rect = mapContainer.getBoundingClientRect();
    const { workplace: { lat, lng } = {} } = this.props;
    if (rect.height > 150 && lat && lng) {
      const mapUrl = staticMap.getSpotImageUrl({
        lat,
        lng,
        height: parseInt(rect.height, 10),
        width: parseInt(rect.width, 10),
        // height: parseInt(rect.height) - 20,
        // width: parseInt(rect.width) - 20
      });
      mapContainer.style.backgroundImage = `url(${mapUrl})`;
      mapContainer.style.marginTop = '.875rem';
    }
  };

  renderService() {
    const { expertise, className, services, weekdays, onClick } = this.props;
    const onlineService = services.find((item) => item.type === 100);
    const onSiteService = services.find((item) => item.type === 200);
    const workplaceService = services.find((item) => item.type === 300);

    return (
      <Card className={className} modifier="expertise" onClick={onClick}>
        <Card.Title modifier="expertise">{expertise.name}</Card.Title>
        <Card.Content>
          <table className="ft-HomeCard__priceInfo">
            <thead>
              <tr>
                <th>On-line</th>
                <th>On-site</th>
                <th>Workplace</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{onlineService ? onlineService.price : '--'}</td>
                <td>{onSiteService ? onSiteService.price : '--'}</td>
                <td>{workplaceService ? workplaceService.price : '--'}</td>
              </tr>
            </tbody>
          </table>
          <div>
            <WeekdayWidget selected={weekdays} />
          </div>
        </Card.Content>
        <div
          className="ft-HomeCard__map"
          ref={(n) => {
            this.mapContainer = n;
          }}
        />
      </Card>
    );
  }

  renderAwesome() {
    const { title, expertise, content, author, onClick } = this.props;
    const displayTitle = expertise ? expertise.name : title;
    return (
      <Card modifier="awesome" onClick={onClick}>
        <Card.Title>{displayTitle}</Card.Title>
        <Card.Content>
          {content && <div className="margin_b_12">{content}</div>}
          <AvatarStamp {...author} />
        </Card.Content>
      </Card>
    );
  }

  render() {
    const { services } = this.props;
    if (services && services.length) {
      return this.renderService();
    }
    return this.renderAwesome();
  }
}

export default ExpertiseItem;
