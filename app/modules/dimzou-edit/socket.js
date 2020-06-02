import createSocket from '@/utils/createSocket';

const socket = createSocket('/dimzou', {
  autoConnect: false,
});

export default socket;
