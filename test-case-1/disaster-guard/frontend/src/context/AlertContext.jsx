import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import AuthContext from './AuthContext';

const AlertContext = createContext();
export const useAlert = () => {
  return useContext(AlertContext);
};
export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  
  const { user } = useContext(AuthContext);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Listen for real-time alert updates
  useEffect(() => {
    if (!socket) return;

    socket.on('alertUpdate', (newAlert) => {
      setAlerts((prevAlerts) => {
        // Check if alert already exists (update) or is new (add)
        const existingAlertIndex = prevAlerts.findIndex(
          (alert) => alert._id === newAlert._id || alert.id === newAlert.id
        );

        if (existingAlertIndex !== -1) {
          // Update existing alert
          const updatedAlerts = [...prevAlerts];
          updatedAlerts[existingAlertIndex] = newAlert;
          return updatedAlerts;
        } else {
          // Add new alert
          return [...prevAlerts, newAlert];
        }
      });
    });

    return () => {
      socket.off('alertUpdate');
    };
  }, [socket]);

  // Initial data for testing without backend
  const mockAlerts = [
    {
      id: '1',
      title: 'Earthquake Warning',
      description: 'Magnitude 5.2 earthquake detected. Take precautions.',
      type: 'Earthquake',
      severity: 'High',
      location: { address: 'Los Angeles, CA' },
      status: 'Active',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Flash Flood Alert',
      description: 'Heavy rainfall expected. Flash flooding possible in low-lying areas.',
      type: 'Flood',
      severity: 'Medium',
      location: { address: 'Miami, FL' },
      status: 'Active',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Wildfire Notification',
      description: 'Wildfire spreading in northern region. Evacuation may be necessary.',
      type: 'Fire',
      severity: 'Critical',
      location: { address: 'Northern California' },
      status: 'Active',
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      title: 'Hurricane Advisory',
      description: 'Hurricane approaching the coast. Prepare emergency supplies.',
      type: 'Hurricane',
      severity: 'High',
      location: { address: 'Gulf Coast' },
      status: 'Monitoring',
      createdAt: new Date().toISOString()
    }
  ];

  // Get all alerts
  const getAlerts = async () => {
    try {
      setLoading(true);
      
      // Simulate API call for now
      // In a real app, this would be:
      // const response = await axios.get('http://localhost:5000/api/alerts');
      // setAlerts(response.data);
      
      // Using mock data instead
      setTimeout(() => {
        if (alerts.length === 0) {
          setAlerts(mockAlerts);
        }
        setLoading(false);
      }, 500);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch alerts');
      setLoading(false);
    }
  };

  // Create a new alert
  const createAlert = async (alertData) => {
    try {
      setLoading(true);
      
      // In a real app with backend:
      // const response = await axios.post('http://localhost:5000/api/alerts', alertData);
      // const newAlert = response.data;
      
      // Create a new alert with a unique ID
      const newAlert = {
        id: `temp-${Date.now()}`,
        ...alertData,
        createdAt: new Date().toISOString()
      };
      
      // Emit the new alert to other clients if socket exists
      if (socket) {
        socket.emit('newAlert', newAlert);
      }
      
      // Update local state
      setAlerts([...alerts, newAlert]);
      setLoading(false);
      
      return newAlert;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create alert');
      setLoading(false);
      throw err;
    }
  };

  // Update alert status
  const updateAlertStatus = async (id, status) => {
    try {
      setLoading(true);
      
      // Find the alert to update
      const alertToUpdate = alerts.find(alert => alert.id === id || alert._id === id);
      
      if (!alertToUpdate) {
        throw new Error('Alert not found');
      }
      
      // Create updated alert
      const updatedAlert = {
        ...alertToUpdate,
        status: status
      };
      
      // In a real app with backend:
      // const response = await axios.patch(`http://localhost:5000/api/alerts/${id}`, { status });
      // const updatedAlert = response.data;
      
      // Update local state
      const updatedAlerts = alerts.map(alert => 
        (alert.id === id || alert._id === id) ? updatedAlert : alert
      );
      
      setAlerts(updatedAlerts);
      
      // Emit the updated alert to other clients if socket exists
      if (socket) {
        socket.emit('alertUpdate', updatedAlert);
      }
      
      setLoading(false);
      return updatedAlert;
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to update alert');
      setLoading(false);
      throw err;
    }
  };

  // Get alerts by proximity (location-based)
  const getNearbyAlerts = async (longitude, latitude, maxDistance = 50) => {
    try {
      setLoading(true);
      
      // In a real app:
      // const response = await axios.get(
      //   `http://localhost:5000/api/alerts/nearby?lng=${longitude}&lat=${latitude}&distance=${maxDistance}`
      // );
      // return response.data;
      
      // Mock implementation - just return all alerts for now
      setLoading(false);
      return alerts;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch nearby alerts');
      setLoading(false);
      throw err;
    }
  };

  return (
    <AlertContext.Provider
      value={{
        alerts,
        loading,
        error,
        getAlerts,
        createAlert,
        updateAlertStatus,
        getNearbyAlerts
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export default AlertContext;