// frontend/src/services/disasterApi.js

// Using USGS Earthquake API as an example
const EARTHQUAKE_API = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

// Using PDC (Pacific Disaster Center) API would require registration
const PDC_API_KEY = 'YOUR_PDC_API_KEY'; // If you register for PDC API

export const disasterService = {
  // Get recent earthquakes (past day)
  getRecentEarthquakes: async () => {
    try {
      // M2.5+ earthquakes in the past day
      const response = await fetch(`${EARTHQUAKE_API}/all_day.geojson`);
      
      if (!response.ok) {
        throw new Error('Earthquake data fetch failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching earthquake data:', error);
      throw error;
    }
  },
  
  // Get significant earthquakes (past 30 days)
  getSignificantEarthquakes: async () => {
    try {
      const response = await fetch(`${EARTHQUAKE_API}/significant_month.geojson`);
      
      if (!response.ok) {
        throw new Error('Significant earthquake data fetch failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching significant earthquake data:', error);
      throw error;
    }
  },
  
  // Get wildfire data (sample - would need a specific API)
  getWildfireData: async () => {
    try {
      // This would be replaced with an actual wildfire API
      // Example: NASA FIRMS API or USFS API
      const mockData = {
        fires: [
          { id: 1, name: "Canyon Fire", lat: 34.052235, lon: -118.243683, status: "Active", area: "5000 acres" },
          { id: 2, name: "Mountain Blaze", lat: 37.773972, lon: -122.431297, status: "Contained", area: "1200 acres" }
        ]
      };
      
      return mockData;
    } catch (error) {
      console.error('Error fetching wildfire data:', error);
      throw error;
    }
  },
  
  // Get flood warnings (sample - would need a specific API)
  getFloodWarnings: async () => {
    try {
      // This would be replaced with an actual flood warning API
      // Example: NOAA API or Weather.gov API
      const mockData = {
        warnings: [
          { id: 1, region: "Mississippi River Basin", level: "Moderate", expires: "2025-03-20T18:00:00Z" },
          { id: 2, region: "Coastal Florida", level: "Minor", expires: "2025-03-18T12:00:00Z" }
        ]
      };
      
      return mockData;
    } catch (error) {
      console.error('Error fetching flood warnings:', error);
      throw error;
    }
  }
};