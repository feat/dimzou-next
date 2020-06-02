import createSocket from '@/utils/createSocket';

const socket = createSocket('/activity', {
  autoConnect: false,
});

export default socket;
