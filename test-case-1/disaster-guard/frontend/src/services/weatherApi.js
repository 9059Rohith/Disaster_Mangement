// frontend/src/services/weatherApi.js

const API_KEY = 'a4c806791465a3d64a522cdfe0957f1b'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const weatherService = {
  // Get current weather for a location
  getCurrentWeather: async (city) => {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Weather data fetch failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  },
  
  // Get 5-day forecast for a location
  getForecast: async (city) => {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Forecast data fetch failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw error;
    }
  },
  
  // Get weather alerts (using OneCall API)
  getWeatherAlerts: async (lat, lon) => {
    try {
      const response = await fetch(
        `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Weather alerts fetch failed');
      }
      
      const data = await response.json();
      return data.alerts || [];
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      throw error;
    }
  }
};