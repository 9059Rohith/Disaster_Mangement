// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import AlertContext from '../context/AlertContext';

// Enhanced DisasterMap component with OpenStreetMap integration
const DisasterMap = () => {
  const [mapMode, setMapMode] = useState('standard');
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [animatedDisasters, setAnimatedDisasters] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layerGroups = useRef({
    markers: null,
    circles: null,
    heatmap: null
  });
  
  // Function to fetch real-time disaster data
  const fetchDisasterData = async () => {
    try {
      setLoading(true);
      
      // USGS Earthquake API - Get earthquakes from the past 30 days with magnitude >= 4.5
      const earthquakeResponse = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson');
      const earthquakeData = await earthquakeResponse.json();
      
      // NASA EONET API for other natural disasters (wildfires, storms, etc.)
      const eonetResponse = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?status=open');
      const eonetData = await eonetResponse.json();
      
      // Process USGS earthquake data
      const earthquakes = earthquakeData.features.map(feature => {
        const { mag, place, time, alert } = feature.properties;
        const [longitude, latitude] = feature.geometry.coordinates;
        
        // Determine severity based on magnitude
        let severity = 'Low';
        if (mag >= 7) severity = 'Critical';
        else if (mag >= 6) severity = 'High';
        else if (mag >= 5) severity = 'Medium';
        else if (mag >= 4.5) severity = 'Low';
        
        // Estimate affected population (rough estimate for demo purposes)
        const affectedPopulation = Math.round(Math.pow(10, mag - 2) * 1000);
        const affectedArea = `${Math.round(Math.pow(mag, 2))} sq miles`;
        
        return {
          id: `eq-${feature.id}`,
          type: 'Earthquake',
          title: `M${mag.toFixed(1)} Earthquake`,
          location: place,
          lat: latitude,
          lng: longitude,
          severity,
          date: new Date(time).toISOString().split('T')[0],
          affectedArea,
          affectedPopulation,
          radius: mag * 10000, // Radius in meters
          intensity: mag / 10, // Normalized intensity
          description: `Magnitude ${mag.toFixed(1)} earthquake detected. ${alert ? `Alert level: ${alert}` : ''}`,
          source: 'USGS'
        };
      });
      
      // Process NASA EONET data (wildfires, storms, etc.)
      const otherDisasters = eonetData.events.map(event => {
        // Get the latest coordinates
        const geometry = event.geometry[event.geometry.length - 1];
        let coordinates = [0, 0];
        
        if (geometry && geometry.coordinates) {
          // EONET uses [long, lat], we need [lat, long]
          coordinates = Array.isArray(geometry.coordinates[0]) 
            ? [geometry.coordinates[0][1], geometry.coordinates[0][0]] // For polygons
            : [geometry.coordinates[1], geometry.coordinates[0]]; // For points
        }
        
        // Determine disaster type from categories
        const categoryId = event.categories[0].id;
        let type = 'Other';
        
        // Map EONET categories to our disaster types
        if (categoryId === 'wildfires') type = 'Wildfire';
        else if (categoryId === 'severeStorms') type = 'Hurricane';
        else if (categoryId === 'volcanoes') type = 'Volcano';
        else if (categoryId === 'seaLakeIce') type = 'Flood';
        else if (categoryId === 'drought') type = 'Drought';
        
        // Determine severity (simplified)
        const daysSinceStart = Math.floor((new Date() - new Date(geometry.date)) / (1000 * 60 * 60 * 24));
        let severity = 'Medium';
        if (daysSinceStart < 3) severity = 'High';
        if (type === 'Wildfire' || type === 'Hurricane') severity = 'Critical';
        
        // For demo: estimate affected area based on type
        let affectedArea = '10 sq miles';
        let radius = 5000; // default radius in meters
        
        if (type === 'Wildfire') {
          radius = 8000;
          affectedArea = `${Math.round(20 + Math.random() * 80)} sq miles`;
        } else if (type === 'Hurricane') {
          radius = 30000;
          affectedArea = `${Math.round(100 + Math.random() * 200)} sq miles`;
        } else if (type === 'Flood') {
          radius = 15000;
          affectedArea = `${Math.round(30 + Math.random() * 70)} sq miles`;
        }
        
        return {
          id: `eonet-${event.id}`,
          type,
          title: event.title,
          location: event.title.split('(')[0].trim(), // Extract location from title
          lat: coordinates[0],
          lng: coordinates[1],
          severity,
          date: geometry.date.split('T')[0],
          affectedArea,
          affectedPopulation: Math.floor(Math.random() * 50000) + 1000, // Placeholder estimate
          radius,
          intensity: severity === 'Critical' ? 1.0 : severity === 'High' ? 0.8 : 0.6,
          description: `${event.description || event.title}. Ongoing event being monitored.`,
          source: 'NASA EONET'
        };
      }).filter(disaster => 
        // Filter out disasters without valid coordinates
        disaster.lat && 
        disaster.lng && 
        !isNaN(disaster.lat) && 
        !isNaN(disaster.lng)
      );
      
      // Combine all disaster data
      const allDisasters = [...earthquakes, ...otherDisasters];
      setDisasters(allDisasters);
      
      if (isFirstLoad) {
        setAnimatedDisasters(allDisasters);
        setIsFirstLoad(false);
        
        // Set first disaster as selected by default if available
        if (allDisasters.length > 0) {
          setSelectedDisaster(allDisasters[0]);
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching disaster data:', err);
      setError('Unable to fetch disaster information. Please try again.');
      setLoading(false);
    }
  };

  // Helper function to safely render location data
  const renderLocation = (location) => {
    if (typeof location === 'string') {
      return location;
    }
    
    if (typeof location === 'object') {
      // If it has an address property, use that
      if (location.address) return location.address;
      
      // If it has name or display properties
      if (location.name) return location.name;
      if (location.display) return location.display;
      
      // Try to create a formatted string from object properties
      try {
        return JSON.stringify(location);
      } catch (e) {
        return 'Location data unavailable';
      }
    }
    
    // Fallback for null or undefined
    return 'Unknown location';
  };

  // Get color based on severity
  const getSeverityColor = (severity, alpha = 1) => {
    switch (severity) {
      case 'Critical': return `rgba(255, 82, 140, ${alpha})`; // cyberpunk magenta
      case 'High': return `rgba(255, 206, 0, ${alpha})`; // cyberpunk yellow
      case 'Medium': return `rgba(0, 255, 255, ${alpha})`; // cyberpunk cyan
      case 'Low': return `rgba(0, 255, 136, ${alpha})`; // cyberpunk green
      default: return `rgba(180, 180, 180, ${alpha})`; // gray
    }
  };

  // Get emoji icon based on disaster type
  const getDisasterIcon = (type) => {
    switch (type) {
      case 'Flood': return '🌊';
      case 'Wildfire': return '🔥';
      case 'Earthquake': return '🌋';
      case 'Hurricane': return '🌀';
      case 'Tornado': return '🌪️';
      case 'Volcano': return '🌋';
      case 'Drought': return '🏜️';
      default: return '⚠️';
    }
  };

  // Initialize map
  useEffect(() => {
    // Function to load Leaflet and initialize map
    const initializeMap = async () => {
      try {
        // Add Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const linkElement = document.createElement('link');
          linkElement.rel = 'stylesheet';
          linkElement.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          linkElement.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          linkElement.crossOrigin = '';
          document.head.appendChild(linkElement);
        }
        
        // Check if Leaflet is already loaded
        if (!window.L) {
          // Create script to load Leaflet
          await new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
            script.crossOrigin = '';
            script.onload = () => resolve();
            document.body.appendChild(script);
          });
        }
        
        // Wait a bit for the DOM to stabilize
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Initialize map if container exists and Leaflet is loaded
        if (mapRef.current && window.L) {
          // Initialize map
          if (!mapInstance.current) {
            mapInstance.current = window.L.map(mapRef.current, {
              center: [20, 0], // Center on world map
              zoom: 2,
              preferCanvas: true, // Better performance for many markers
              worldCopyJump: true // Enables smooth scrolling across date line
            });
            
            // Add tile layer - we'll use a cyberpunk-themed map if available
            let tileLayer;
            
            // Try to use a dark/cyberpunk themed map
            if (mapMode === 'cyberpunk') {
              // Use a dark theme map if available
              tileLayer = window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                maxZoom: 19
              });
            } else {
              // Use standard OpenStreetMap tiles
              tileLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
              });
            }
            
            tileLayer.addTo(mapInstance.current);
            
            // Create layer groups for organization
            layerGroups.current.markers = window.L.layerGroup().addTo(mapInstance.current);
            layerGroups.current.circles = window.L.layerGroup().addTo(mapInstance.current);
            layerGroups.current.heatmap = window.L.layerGroup().addTo(mapInstance.current);
            
            // Trigger a resize to ensure map is properly displayed
            setTimeout(() => {
              if (mapInstance.current) {
                mapInstance.current.invalidateSize();
              }
            }, 400);
          }
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        setError('Failed to load map. Please refresh the page.');
      }
    };
    
    // Initialize map and fetch disaster data
    initializeMap();
    fetchDisasterData();
    
    // Cleanup function
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [mapMode]);
  
  // Update map markers when disasters change
  useEffect(() => {
    if (!window.L || !mapInstance.current) return;
    
    // Function to update markers on the map
    const updateMap = () => {
      // Clear existing layers
      layerGroups.current.markers.clearLayers();
      layerGroups.current.circles.clearLayers();
      
      // Get disasters to display (either animated or original)
      const disastersToDisplay = trackingEnabled && animatedDisasters.length > 0 
        ? animatedDisasters 
        : disasters;
      
      // Add markers and circles for each disaster
      disastersToDisplay.forEach(disaster => {
        // Create marker with custom icon style
        const marker = window.L.circleMarker([disaster.lat, disaster.lng], {
          radius: 8,
          fillColor: getSeverityColor(disaster.severity),
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        });
        
        // Add popup with details
        marker.bindPopup(`
          <div class="disaster-popup" style="min-width:220px;">
            <h3 style="font-size:16px;font-weight:bold;margin-bottom:8px;color:#333;display:flex;align-items:center;">
              <span style="margin-right:6px;">${getDisasterIcon(disaster.type)}</span>
              ${disaster.title}
            </h3>
            <p style="font-size:14px;margin-bottom:5px;">${renderLocation(disaster.location)}</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;font-size:13px;">
              <div>
                <span style="color:#666;">Severity:</span>
                <div style="margin-top:4px;">
                  <span style="padding:3px 8px;border-radius:12px;font-weight:500;background-color:${getSeverityColor(disaster.severity, 0.2)};color:${getSeverityColor(disaster.severity)};">
                    ${disaster.severity}
                  </span>
                </div>
              </div>
              <div>
                <span style="color:#666;">Date:</span>
                <div style="font-weight:500;">${disaster.date}</div>
              </div>
              <div>
                <span style="color:#666;">Area:</span>
                <div style="font-weight:500;">${disaster.affectedArea}</div>
              </div>
              <div>
                <span style="color:#666;">Source:</span>
                <div style="font-weight:500;">${disaster.source}</div>
              </div>
            </div>
            <p style="font-size:13px;margin-top:12px;color:#555;">${disaster.description}</p>
          </div>
        `);
        
        // Add hover effect
        marker.on('mouseover', function() {
          this.setStyle({
            radius: 10,
            weight: 3
          });
        });
        
        marker.on('mouseout', function() {
          this.setStyle({
            radius: 8,
            weight: 2
          });
        });
        
        // Handle click event
        marker.on('click', () => {
          setSelectedDisaster(disaster);
        });
        
        // Add marker to layer group
        layerGroups.current.markers.addLayer(marker);
        
        // Add affected area circle
        const circle = window.L.circle([disaster.lat, disaster.lng], {
          radius: disaster.radius,
          fillColor: getSeverityColor(disaster.severity, 0.2),
          color: getSeverityColor(disaster.severity, 0.6),
          weight: 1,
          opacity: 0.7,
          fillOpacity: 0.2
        });
        
        layerGroups.current.circles.addLayer(circle);
      });
      
      // Generate heatmap if enabled
      if (showHeatmap) {
        updateHeatmap(disastersToDisplay);
      } else if (layerGroups.current.heatmap) {
        layerGroups.current.heatmap.clearLayers();
      }
    };
    
    updateMap();
  }, [disasters, animatedDisasters, trackingEnabled, showHeatmap, selectedDisaster]);
  
  // Handle map mode changes
  useEffect(() => {
    if (!window.L || !mapInstance.current) return;
    
    // Change tile layer based on mode
    const changeTileLayer = () => {
      // Remove current tile layer
      mapInstance.current.eachLayer(layer => {
        if (layer instanceof window.L.TileLayer) {
          mapInstance.current.removeLayer(layer);
        }
      });
      
      // Add new tile layer based on mode
      let newTileLayer;
      
      if (mapMode === 'satellite') {
        // Satellite view
        newTileLayer = window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          maxZoom: 19
        });
      } else if (mapMode === 'terrain') {
        // Terrain view
        newTileLayer = window.L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
          maxZoom: 17
        });
      } else if (mapMode === 'cyberpunk') {
        // Dark/cyberpunk theme
        newTileLayer = window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19
        });
      } else {
        // Standard view (default)
        newTileLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        });
      }
      
      newTileLayer.addTo(mapInstance.current);
      newTileLayer.bringToBack();
    };
    
    changeTileLayer();
  }, [mapMode]);
  
  // Set up simulation for real-time tracking
  useEffect(() => {
    if (trackingEnabled) {
      const interval = setInterval(() => {
        // Simulate movement and changes in disaster data
        const updatedDisasters = disasters.map(disaster => {
          return {
            ...disaster,
            lat: disaster.lat + (Math.random() - 0.5) * 0.05,
            lng: disaster.lng + (Math.random() - 0.5) * 0.05,
            radius: disaster.radius * (0.95 + Math.random() * 0.1) // Fluctuate radius
          };
        });
        
        setAnimatedDisasters(updatedDisasters);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [trackingEnabled, disasters]);
  
  // Create a simplified heatmap effect using Leaflet
  const updateHeatmap = (disastersToShow) => {
    if (!window.L || !mapInstance.current) return;
    
    // Clear existing heatmap
    layerGroups.current.heatmap.clearLayers();
    
    // Create a "heatmap" effect using circles with gradients
    disastersToShow.forEach(disaster => {
      // Calculate intensity
      const intensity = disaster.intensity || 0.7;
      
      // Create multiple overlapping circles with decreasing opacity to simulate heatmap
      for (let i = 1; i <= 4; i++) {
        const radius = disaster.radius * (i * 0.5);
        const opacity = (intensity * (1 - (i * 0.2))).toFixed(2);
        
        if (opacity > 0) {
          const heatCircle = window.L.circle([disaster.lat, disaster.lng], {
            radius,
            fillColor: getSeverityColor(disaster.severity),
            color: 'transparent',
            fillOpacity: opacity
          });
          
          layerGroups.current.heatmap.addLayer(heatCircle);
        }
      }
    });
  };
  
  // Handle disaster selection
  const handleDisasterClick = (disaster) => {
    setSelectedDisaster(disaster);
    
    // Center map on selected disaster
    if (mapInstance.current) {
      mapInstance.current.setView([disaster.lat, disaster.lng], 6);
    }
  };
  
  // Close details panel
  const handleCloseDetails = () => {
    setSelectedDisaster(null);
  };

  // Mock data for analytics chart
  const analyticsData = [
    { date: '2025-03-01', alerts: 5, resolved: 2 },
    { date: '2025-03-02', alerts: 7, resolved: 3 },
    { date: '2025-03-03', alerts: 4, resolved: 4 },
    { date: '2025-03-04', alerts: 6, resolved: 5 },
    { date: '2025-03-05', alerts: 8, resolved: 4 },
    { date: '2025-03-06', alerts: 10, resolved: 6 },
    { date: '2025-03-07', alerts: 12, resolved: 8 },
  ];

  if (loading && !disasters.length) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error && !disasters.length) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading map data: {error}
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden bg-gradient-to-b from-gray-900 to-purple-900 p-1">
      {/* Glassmorphism container */}
      <div className="backdrop-blur-md bg-black/40 rounded-xl shadow-xl border border-purple-500/30 p-4">
        {/* Map controls */}
        <div className="absolute top-6 right-6 z-10 flex space-x-2 bg-black/70 backdrop-blur-sm p-2 rounded-xl border border-cyan-500/50">
          <button 
            onClick={() => setMapMode('standard')} 
            className={`px-3 py-1.5 text-xs font-medium rounded-md shadow-lg transition-all duration-300 ${mapMode === 'standard' 
              ? 'bg-cyan-600 text-white shadow-cyan-500/50' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            Standard
          </button>
          <button 
            onClick={() => setMapMode('satellite')} 
            className={`px-3 py-1.5 text-xs font-medium rounded-md shadow-lg transition-all duration-300 ${mapMode === 'satellite' 
              ? 'bg-cyan-600 text-white shadow-cyan-500/50' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            Satellite
          </button>
          <button 
            onClick={() => setMapMode('terrain')} 
            className={`px-3 py-1.5 text-xs font-medium rounded-md shadow-lg transition-all duration-300 ${mapMode === 'terrain' 
              ? 'bg-cyan-600 text-white shadow-cyan-500/50' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            Terrain
          </button>
          <button 
            onClick={() => setMapMode('cyberpunk')} 
            className={`px-3 py-1.5 text-xs font-medium rounded-md shadow-lg transition-all duration-300 ${mapMode === 'cyberpunk' 
              ? 'bg-cyan-600 text-white shadow-cyan-500/50' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            Cyber
          </button>
        </div>

        {/* Map container */}
        <div 
          ref={mapRef} 
          style={{ 
            width: '100%', 
            height: '500px', 
            borderRadius: '12px', 
            overflow: 'hidden',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)'
          }}
          className="relative"
        >
          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500 mb-2"></div>
                <p className="text-cyan-400 text-sm">Loading disaster data...</p>
              </div>
            </div>
          )}
        </div>
      
        {/* Map legend and controls */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left panel - legend */}
          <div className="bg-black/50 backdrop-blur-md p-4 rounded-xl border border-purple-500/30 text-white">
            <h4 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Disaster Legend
            </h4>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center">
                <span className="mr-1 text-lg">🌊</span>
                <span>Flood</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1 text-lg">🔥</span>
                <span>Wildfire</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1 text-lg">🌋</span>
                <span>Earthquake</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1 text-lg">🌀</span>
                <span>Hurricane</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1 text-lg">🌪️</span>
                <span>Tornado</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1 text-lg">🏜️</span>
                <span>Drought</span>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-cyan-400 mt-3 mb-2">Severity</h4>
            <div className="grid grid-cols-1 gap-1 text-xs">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getSeverityColor('Critical') }}></span>
<span>Critical</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getSeverityColor('High') }}></span>
                <span>High</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getSeverityColor('Medium') }}></span>
                <span>Medium</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getSeverityColor('Low') }}></span>
                <span>Low</span>
              </div>
            </div>

            {/* Display current selected disaster if any */}
            {selectedDisaster && (
              <div className="mt-4 pt-4 border-t border-purple-500/30">
                <h4 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Selected Disaster
                </h4>
                <div className="bg-black/30 p-2 rounded-lg">
                  <div className="flex items-center mb-1">
                    <span className="text-lg mr-2">{getDisasterIcon(selectedDisaster.type)}</span>
                    <span className="font-medium text-sm">{selectedDisaster.title}</span>
                  </div>
                  <p className="text-xs text-gray-300 mb-1">{renderLocation(selectedDisaster.location)}</p>
                  <div className="grid grid-cols-2 gap-1 text-xs mt-2">
                    <div>
                      <span className="text-gray-400">Date:</span>
                      <div className="text-white">{selectedDisaster.date}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Severity:</span>
                      <div>
                        <span 
                          className="px-1.5 py-0.5 rounded-full text-xs"
                          style={{ 
                            backgroundColor: getSeverityColor(selectedDisaster.severity, 0.2),
                            color: getSeverityColor(selectedDisaster.severity)
                          }}
                        >
                          {selectedDisaster.severity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Right panel - analytics graph */}
          <div className="bg-black/50 backdrop-blur-md p-4 rounded-xl border border-purple-500/30 text-white">
            <h4 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h6a1 1 0 100-2H3zm0 4a1 1 0 100 2h8a1 1 0 100-2H3z" clipRule="evenodd" />
              </svg>
              Disaster Trends
            </h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={analyticsData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#00ffff" tick={{ fill: '#00ffff', fontSize: 10 }} />
                  <YAxis stroke="#00ffff" tick={{ fill: '#00ffff', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                      border: '1px solid #ff00ff',
                      borderRadius: '4px',
                      color: '#fff'
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#fff', fontSize: 12 }} />
                  <Line type="monotone" dataKey="alerts" stroke="#ff00ff" activeDot={{ r: 8 }} strokeWidth={3} />
                  <Line type="monotone" dataKey="resolved" stroke="#00ffcc" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Advanced controls */}
        <div className="mt-4 flex flex-wrap gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHeatmap(!showHeatmap)} 
            className={`px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center transition-all duration-300 ${
              showHeatmap 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-pink-500/50' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTrackingEnabled(!trackingEnabled)} 
            className={`px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center transition-all duration-300 ${
              trackingEnabled 
                ? 'bg-gradient-to-r from-green-600 to-cyan-600 text-white shadow-cyan-500/50' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {trackingEnabled ? 'Disable Tracking' : 'Enable Real-time Tracking'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchDisasterData()}
            className="px-4 py-2 rounded-full text-sm font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 shadow-lg flex items-center transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => mapInstance.current && mapInstance.current.setView([20, 0], 2)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 shadow-lg flex items-center transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Reset View
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// The main Dashboard component
const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { alerts, getAlerts, updateAlertStatus, loading } = useContext(AlertContext);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [resolvedAlerts, setResolvedAlerts] = useState([]);
  
  useEffect(() => {
    getAlerts();
  }, []);
  
  useEffect(() => {
    if (alerts && alerts.length > 0) {
      // Filter for active and resolved alerts
      setActiveAlerts(alerts.filter(alert => alert.status === 'Active'));
      setResolvedAlerts(alerts.filter(alert => alert.status === 'Resolved'));
    }
  }, [alerts]);
  
  // Function to handle resolving an alert
  const handleResolveAlert = async (id) => {
    try {
      await updateAlertStatus(id, 'Resolved');
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };
  
  // Function to reactivate an alert
  const handleReactivateAlert = async (id) => {
    try {
      await updateAlertStatus(id, 'Active');
    } catch (error) {
      console.error('Failed to reactivate alert:', error);
    }
  };
  
  // Helper function to safely render location data
  const renderLocation = (location) => {
    if (typeof location === 'string') {
      return location;
    }
    
    if (typeof location === 'object') {
      // If it has an address property, use that
      if (location.address) return location.address;
      
      // If it has name or display properties
      if (location.name) return location.name;
      if (location.display) return location.display;
      
      // Try to create a formatted string from object properties
      try {
        return JSON.stringify(location);
      } catch (e) {
        return 'Location data unavailable';
      }
    }
    
    // Fallback for null or undefined
    return 'Unknown location';
  };
  
  // Summary stats with improved colors
  const stats = [
    { 
      name: 'Active Alerts', 
      value: activeAlerts.length, 
      icon: (
        <div className="rounded-md bg-red-500 p-3 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      ),
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    },
    { 
      name: 'Resolved Alerts', 
      value: resolvedAlerts.length,
      icon: (
        <div className="rounded-md bg-green-500 p-3 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ),
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    { 
      name: 'Your Role', 
      value: user?.role || 'User',
      icon: (
        <div className="rounded-md bg-blue-500 p-3 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      ),
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    { 
      name: 'Communities', 
      value: '3',
      icon: (
        <div className="rounded-md bg-purple-500 p-3 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      ),
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
  ];
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
          Dashboard
        </h1>
        <Link
          to="/alerts"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Manage Alerts
        </Link>
      </div>

      {/* Stats Grid - Enhanced version */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className={`overflow-hidden shadow rounded-lg border ${stat.bgColor} transition-transform hover:scale-105`}
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">{stat.icon}</div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className={`mt-1 text-3xl font-semibold ${stat.textColor}`}>
                    {stat.value}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Map Section - Using our enhanced DisasterMap component */}
      <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Disaster Map
          </h3>
          <DisasterMap />
        </div>
      </div>

      {/* Active Alerts Section */}
      <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Active Alerts
          </h3>
          
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            </div>
          ) : activeAlerts.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-gray-500">No active alerts at this time.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeAlerts.map((alert) => (
                    <tr key={alert.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{alert.title}</div>
                            <div className="text-sm text-gray-500">{alert.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {renderLocation(alert.location)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          {alert.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {alert.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleResolveAlert(alert.id)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Resolve
                        </button>
                        <Link to={`/alerts/${alert.id}`} className="text-indigo-600 hover:text-indigo-900">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Resolved Alerts Section */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Resolved Alerts
          </h3>
          
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            </div>
          ) : resolvedAlerts.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-gray-500">No resolved alerts found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {resolvedAlerts.map((alert) => (
                    <tr key={alert.id} className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-700">{alert.title}</div>
                            <div className="text-sm text-gray-500">{alert.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {renderLocation(alert.location)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {alert.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {alert.resolvedAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleReactivateAlert(alert.id)}
                          className="text-orange-600 hover:text-orange-900 mr-4"
                        >
                          Reactivate
                        </button>
                        <Link to={`/alerts/${alert.id}`} className="text-indigo-600 hover:text-indigo-900">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;