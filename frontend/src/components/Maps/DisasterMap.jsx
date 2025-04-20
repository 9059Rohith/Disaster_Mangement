// frontend/src/components/Maps/DisasterMap.jsx
import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { disasterService } from '../../services/disasterApi';

// Replace with your actual Mapbox token
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

const DisasterMap = ({ height = '500px', center = [-98.5795, 39.8283], zoom = 3 }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [disasters, setDisasters] = useState({
    earthquakes: [],
    wildfires: [],
    floods: []
  });
  const [activeFilter, setActiveFilter] = useState('all');

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: center,
      zoom: zoom
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => map.current.remove();
  }, [center, zoom]);

  // Load disaster data
  useEffect(() => {
    const fetchDisasterData = async () => {
      try {
        // Fetch earthquake data
        const earthquakeData = await disasterService.getRecentEarthquakes();
        
        // Fetch other disaster data
        const wildfireData = await disasterService.getWildfireData();
        const floodData = await disasterService.getFloodWarnings();
        
        setDisasters({
          earthquakes: earthquakeData.features || [],
          wildfires: wildfireData.fires || [],
          floods: floodData.warnings || []
        });
      } catch (error) {
        console.error('Error fetching disaster data:', error);
      }
    };

    fetchDisasterData();
  }, []);

  // Update map when disaster data changes
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.disaster-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add earthquake markers
    if (activeFilter === 'all' || activeFilter === 'earthquakes') {
      disasters.earthquakes.forEach(quake => {
        const { coordinates } = quake.geometry;
        const { mag, place, time } = quake.properties;
        
        const magnitude = parseFloat(mag);
        // Scale marker size based on magnitude
        const size = Math.max(10, magnitude * 5);
        
        const markerEl = document.createElement('div');
        markerEl.className = 'disaster-marker earthquake-marker';
        markerEl.style.width = `${size}px`;
        markerEl.style.height = `${size}px`;
        markerEl.style.borderRadius = '50%';
        markerEl.style.backgroundColor = 'rgba(255, 0, 0, 0.6)';
        markerEl.style.border = '2px solid #fff';
        
        new mapboxgl.Marker(markerEl)
          .setLngLat([coordinates[0], coordinates[1]])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <h3>Magnitude ${mag} Earthquake</h3>
                <p>${place}</p>
                <p>${new Date(time).toLocaleString()}</p>
              `)
          )
          .addTo(map.current);
      });
    }

    // Add wildfire markers
    if (activeFilter === 'all' || activeFilter === 'wildfires') {
      disasters.wildfires.forEach(fire => {
        const markerEl = document.createElement('div');
        markerEl.className = 'disaster-marker wildfire-marker';
        markerEl.style.width = '15px';
        markerEl.style.height = '15px';
        markerEl.style.borderRadius = '50%';
        markerEl.style.backgroundColor = 'rgba(255, 165, 0, 0.8)';
        markerEl.style.border = '2px solid #fff';
        
        new mapboxgl.Marker(markerEl)
          .setLngLat([fire.lon, fire.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <h3>${fire.name}</h3>
                <p>Status: ${fire.status}</p>
                <p>Area: ${fire.area}</p>
              `)
          )
          .addTo(map.current);
      });
    }

    // Add flood warning visualization
    // This is simplified - actual implementation would depend on your data format
    if (activeFilter === 'all' || activeFilter === 'floods') {
      // For demonstration purposes - would use actual geocoded data
      const floodCoordinates = {
        "Mississippi River Basin": [-90.0000, 37.0000],
        "Coastal Florida": [-81.5158, 27.6648]
      };
      
      disasters.floods.forEach(flood => {
        if (floodCoordinates[flood.region]) {
          const markerEl = document.createElement('div');
          markerEl.className = 'disaster-marker flood-marker';
          markerEl.style.width = '20px';
          markerEl.style.height = '20px';
          markerEl.style.borderRadius = '50%';
          markerEl.style.backgroundColor = 'rgba(0, 0, 255, 0.6)';
          markerEl.style.border = '2px solid #fff';
          
          new mapboxgl.Marker(markerEl)
            .setLngLat(floodCoordinates[flood.region])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <h3>Flood Warning: ${flood.region}</h3>
                  <p>Level: ${flood.level}</p>
                  <p>Expires: ${new Date(flood.expires).toLocaleString()}</p>
                `)
            )
            .addTo(map.current);
        }
      });
    }
  }, [disasters, mapLoaded, activeFilter]);

  return (
    <div className="relative w-full">
      <div ref={mapContainer} style={{ width: '100%', height }} />
      
      <div className="absolute top-4 right-4 bg-white p-2 rounded shadow">
        <h3 className="text-sm font-bold mb-1">Filter Disasters</h3>
        <div className="flex flex-col gap-1">
          <label className="flex items-center">
            <input
              type="radio"
              value="all"
              checked={activeFilter === 'all'}
              onChange={() => setActiveFilter('all')}
              className="mr-1"
            />
            <span className="text-sm">All</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="earthquakes"
              checked={activeFilter === 'earthquakes'}
              onChange={() => setActiveFilter('earthquakes')}
              className="mr-1"
            />
            <span className="text-sm">Earthquakes</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="wildfires"
              checked={activeFilter === 'wildfires'}
              onChange={() => setActiveFilter('wildfires')}
              className="mr-1"
            />
            <span className="text-sm">Wildfires</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="floods"
              checked={activeFilter === 'floods'}
              onChange={() => setActiveFilter('floods')}
              className="mr-1"
            />
            <span className="text-sm">Floods</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default DisasterMap;