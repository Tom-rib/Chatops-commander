import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_WS_URL || 'http://localhost:3001';

let socket: Socket | null = null;

export const connectSocket = (token: string): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => socket;

export default { connectSocket, disconnectSocket, getSocket };