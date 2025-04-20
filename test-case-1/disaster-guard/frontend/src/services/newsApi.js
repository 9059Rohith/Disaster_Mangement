
// frontend/src/services/newsApi.js

const API_KEY = 'pub_7458394b5f99c60413d37733c776d1df17686'; // Replace with your actual NewsAPI key
const BASE_URL = 'https://newsapi.org/v2';

export const newsService = {
  // Get disaster-related news
  getDisasterNews: async (page = 1) => {
    try {
      const response = await fetch(
        `${BASE_URL}/everything?q=disaster OR earthquake OR hurricane OR flood OR wildfire&language=en&sortBy=publishedAt&pageSize=10&page=${page}&apiKey=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('News fetch failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching disaster news:', error);
      throw error;
    }
  },
  
  // Get news for a specific disaster type
  getNewsByDisasterType: async (disasterType, page = 1) => {
    try {
      const response = await fetch(
        `${BASE_URL}/everything?q=${disasterType}&language=en&sortBy=publishedAt&pageSize=10&page=${page}&apiKey=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`${disasterType} news fetch failed`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${disasterType} news:`, error);
      throw error;
    }
  },
  
  // Get top headlines for a country (useful for local disaster news)
  getLocalNews: async (countryCode = 'us', page = 1) => {
    try {
      const response = await fetch(
        `${BASE_URL}/top-headlines?country=${countryCode}&category=general&pageSize=10&page=${page}&apiKey=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Local news fetch failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching local news:', error);
      throw error;
    }
  }
};