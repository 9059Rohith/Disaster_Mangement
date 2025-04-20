// frontend/src/pages/WeatherForecast.jsx
import React, { useState, useEffect } from 'react';
import { weatherService } from '../services/weatherApi';
import Button from '../components/ui/Button';

import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';
const WeatherForecast = () => {
  const [location, setLocation] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get user's current location if allowed
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
          fetchAlertsByCoords(latitude, longitude);
        },
        () => {
          // If geolocation is denied, use a default location
          setLocation('New York');
          handleSearch('New York');
        }
      );
    }
  }, []);

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      setError('');
      
      // This would be an actual API call to reverse geocode
      // For now, we'll simulate this
      setLocation('Your Location');
      
      // Get current weather and forecast for this location
      // You would need to modify your API service to support coordinates
      const weatherResult = await weatherService.getCurrentWeather('New York');
      setCurrentWeather(weatherResult);
      
      const forecastResult = await weatherService.getForecast('New York');
      processForecasts(forecastResult);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch weather data. Please try another location.');
      setLoading(false);
    }
  };

  const fetchAlertsByCoords = async (lat, lon) => {
    try {
      const alertsResult = await weatherService.getWeatherAlerts(lat, lon);
      setAlerts(alertsResult);
    } catch (err) {
      console.error('Failed to fetch weather alerts:', err);
    }
  };

  const handleSearch = async (city = cityInput) => {
    if (!city) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Get current weather
      const weatherResult = await weatherService.getCurrentWeather(city);
      setCurrentWeather(weatherResult);
      setLocation(city);
      
      // Get forecast
      const forecastResult = await weatherService.getForecast(city);
      processForecasts(forecastResult);
      
      // Get alerts if available
      if (weatherResult.coord) {
        fetchAlertsByCoords(weatherResult.coord.lat, weatherResult.coord.lon);
      }
      
      setCityInput('');
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch weather data. Please check the city name and try again.');
      setLoading(false);
    }
  };

  const processForecasts = (forecastData) => {
    if (!forecastData || !forecastData.list) return;
    
    // Group forecasts by day
    const dailyForecasts = {};
    
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date,
          temps: [],
          descriptions: [],
          icons: []
        };
      }
      
      dailyForecasts[date].temps.push(item.main.temp);
      dailyForecasts[date].descriptions.push(item.weather[0].description);
      dailyForecasts[date].icons.push(item.weather[0].icon);
    });
    
    // Calculate daily averages and most common condition
    const processedForecasts = Object.values(dailyForecasts).map(day => {
      const avgTemp = day.temps.reduce((sum, temp) => sum + temp, 0) / day.temps.length;
      
      // Find most common description
      const descriptionCounts = {};
      day.descriptions.forEach(desc => {
        descriptionCounts[desc] = (descriptionCounts[desc] || 0) + 1;
      });
      const mainDescription = Object.entries(descriptionCounts)
        .sort((a, b) => b[1] - a[1])[0][0];
      
      // Find most common icon
      const iconCounts = {};
      day.icons.forEach(icon => {
        iconCounts[icon] = (iconCounts[icon] || 0) + 1;
      });
      const mainIcon = Object.entries(iconCounts)
        .sort((a, b) => b[1] - a[1])[0][0];
      
      return {
        date: day.date,
        temp: Math.round(avgTemp),
        description: mainDescription,
        icon: mainIcon
      };
    });
    
    setForecast(processedForecasts.slice(0, 5)); // Just take 5 days
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Weather Forecast</h1>
      
      {/* Search Bar */}
      <div className="flex mb-6 gap-2">
        <input
          type="text"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder="Enter city name"
          className="px-4 py-2 border rounded flex-grow"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={() => handleSearch()}>
          {loading ? 'Loading...' : 'Search'}
        </Button>
      </div>
      
      {/* Error Message */}
      {error && <Alert type="error" message={error} className="mb-4" />}
      
      {/* Current Weather */}
      {currentWeather && (
        <Card className="mb-6 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{location}</h2>
              <p className="text-3xl font-bold my-2">{Math.round(currentWeather.main.temp)}°C</p>
              <p className="capitalize">{currentWeather.weather[0].description}</p>
            </div>
            <div className="text-right">
              <img 
                src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`} 
                alt={currentWeather.weather[0].description}
                className="w-20 h-20"
              />
              <div className="flex gap-4 mt-2 text-sm">
                <div>
                  <p>Humidity</p>
                  <p className="font-semibold">{currentWeather.main.humidity}%</p>
                </div>
                <div>
                  <p>Wind</p>
                  <p className="font-semibold">{Math.round(currentWeather.wind.speed * 3.6)} km/h</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      {/* Weather Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Weather Alerts</h2>
          {alerts.map((alert, index) => (
            <Alert
              key={index}
              type="warning"
              message={
                <div>
                  <h3 className="font-bold">{alert.event}</h3>
                  <p>{alert.description}</p>
                  {alert.start && alert.end && (
                    <p className="text-sm mt-1">
                      Valid: {new Date(alert.start * 1000).toLocaleString()} - {new Date(alert.end * 1000).toLocaleString()}
                    </p>
                  )}
                </div>
              }
              className="mb-2"
            />
          ))}
        </div>
      )}
      
      {/* 5-Day Forecast */}
      {forecast.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">5-Day Forecast</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {forecast.map((day, index) => (
              <Card key={index} className="p-4">
                <div className="text-center">
                  <p className="font-semibold">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                  <img 
                    src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`} 
                    alt={day.description}
                    className="w-16 h-16 mx-auto"
                  />
                  <p className="text-xl font-bold">{day.temp}°C</p>
                  <p className="text-sm capitalize">{day.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;