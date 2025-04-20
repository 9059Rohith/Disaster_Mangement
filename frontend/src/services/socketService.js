// frontend/src/services/socketService.js
import { io } from 'socket.io-client';

// Determine the base URL
const getBaseUrl = () => {
  // In production, API calls are relative to the current host
  if (process.env.NODE_ENV === 'production') {
    return '';
  }
  // In development, point to the backend server
  return 'http://localhost:5000';
};

// Initialize socket with connection options
const socket = io(getBaseUrl(), {
  autoConnect: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Connection management
const socketService = {
  connect: () => {
    if (!socket.connected) {
      socket.connect();
    }
  },
  
  disconnect: () => {
    if (socket.connected) {
      socket.disconnect();
    }
  },
  
  // Subscribe to alert notifications
  subscribeToAlerts: (callback) => {
    socket.on('alert_notification', callback);
  },
  
  // Unsubscribe from alert notifications
  unsubscribeFromAlerts: (callback) => {
    socket.off('alert_notification', callback);
  },
  
  // Send a new alert
  emitNewAlert: (alertData) => {
    socket.emit('new_alert', alertData);
  },
  
  // Check connection status
  isConnected: () => socket.connected,
  
  // Add connection listeners
  onConnect: (callback) => {
    socket.on('connect', callback);
  },
  
  onDisconnect: (callback) => {
    socket.on('disconnect', callback);
  },
  
  onError: (callback) => {
    socket.on('connect_error', callback);
  }
};

export default socketService;