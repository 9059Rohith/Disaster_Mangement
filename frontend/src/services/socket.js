import io from 'socket.io-client';

let socket = null;

// Initialize Socket.io connection
const initSocket = () => {
  if (!socket) {
    socket = io('http://localhost:5000');
    
    socket.on('connect', () => {
      console.log('Socket connected');
    });
    
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }
  
  return socket;
};

// Join a specific disaster room for targeted updates
const joinDisasterRoom = (disasterId) => {
  if (socket) {
    socket.emit('joinDisaster', disasterId);
  }
};

// Emit a new alert event
const emitNewAlert = (alert) => {
  if (socket) {
    socket.emit('newAlert', alert);
  }
};

// Disconnect socket
const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export { initSocket, joinDisasterRoom, emitNewAlert, disconnectSocket };