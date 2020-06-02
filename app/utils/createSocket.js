import io from 'socket.io-client';

const hasTaskId = (data) => data && data[2] && data[2].task_id;

export default function createSocket(namespace, options) {
  const socket = io(namespace, options);
  socket.rooms = {};
  socket.handled = {};

  const originOnEvent = socket.onevent;

  const onConnect = () => {
    const evt = new CustomEvent('SocketConnected', {
      detail: {
        namespace: socket.namespace,
        sid: socket.io.engine.id,
      },
    });
    window.dispatchEvent(evt);
  };

  const onEvent = (packet) => {
    const { data } = packet;
    if (hasTaskId(data)) {
      const payload = data[2];
      // escape received messages.
      if (!socket.handled[payload.task_id]) {
        originOnEvent.call(socket, packet);
      } else {
        logging.info('task_info', { room: data[1], task_id: payload.task_id });
        logging.warn('Duplicated task pushed');
      }
      socket.emit('ack', { task_id: payload.task_id, is_success: true });
      socket.handled[payload.task_id] = true;
    } else {
      originOnEvent.call(socket, packet);
    }
  };

  const rejoinRooms = () => {
    Object.entries(socket.rooms).forEach(([channelId, data]) =>
      socket.join(channelId, data),
    );
  };

  socket.on('connect', onConnect);
  socket.onevent = onEvent;

  socket.on('reconnect', rejoinRooms);

  socket.join = (channelId, data) => {
    socket.emit('join_room', channelId, data);
    socket.rooms[channelId] = data;
  };

  socket.private = (channelId, data) =>
    socket.join(`private-${channelId}`, data);

  socket.leave = (channelId, data) => {
    if (socket.rooms[channelId]) {
      socket.emit('leave_room', channelId, data);
      delete socket.rooms[channelId];
    }
    const privateChannel = `private-${channelId}`;
    if (socket.rooms[privateChannel]) {
      socket.emit('leave_room', privateChannel, data);
      delete socket.rooms[privateChannel];
    }
  };

  return socket;
}
