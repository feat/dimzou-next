import { defineMessages } from '@/services/intl';

export default defineMessages({
  walkingLabel: {
    id: 'app.component.direction-map.walking-label',
    defaultMessage: 'Walking',
  },
  transitLabel: {
    id: 'app.component.direction-map.transit-label',
    defaultMessage: 'Transit',
  },
  drivingLabel: {
    id: 'app.component.direction-map.driving-label',
    defaultMessage: 'Driving',
  },
  duration: {
    id: 'app.component.direction-map.duration',
    defaultMessage: '{minute} m',
  },
});