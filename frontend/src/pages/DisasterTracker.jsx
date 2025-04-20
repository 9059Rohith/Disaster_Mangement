// frontend/src/pages/DisasterTracker.jsx
import React, { useState, useEffect } from 'react';
import { disasterService } from '../services/disasterApi';
import DisasterMap from '../components/Maps/DisasterMap';
import Button from '../components/ui/Button';

import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';


const DisasterTracker = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [earthquakes, setEarthquakes] = useState([]);
  const [wildfires, setWildfires] = useState([]);
  const [floods, setFloods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDisasterData();
  }, []);

  const fetchDisasterData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch earthquake data
      const earthquakeData = await disasterService.getRecentEarthquakes();
      setEarthquakes(earthquakeData.features || []);
      
      // Fetch significant earthquakes for the more severe events
      const significantQuakes = await disasterService.getSignificantEarthquakes();
      
      // Combine and deduplicate
      if (significantQuakes && significantQuakes.features) {
        const allIds = new Set(earthquakes.map(quake => quake.id));
        const newSignificant = significantQuakes.features.filter(quake => !allIds.has(quake.id));
        setEarthquakes(prev => [...prev, ...newSignificant]);
      }
      
      // Fetch wildfire data
      const wildfireData = await disasterService.getWildfireData();
      setWildfires(wildfireData.fires || []);
      
      // Fetch flood warning data
      const floodData = await disasterService.getFloodWarnings();
      setFloods(floodData.warnings || []);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching disaster data:', err);
      setError('Unable to fetch disaster data. Please try again later.');
      setLoading(false);
    }
  };

  // Calculate disaster stats
  const getStats = () => {
    return {
      earthquakeCount: earthquakes.length,
      wildfireCount: wildfires.length,
      floodCount: floods.length,
      totalCount: earthquakes.length + wildfires.length + floods.length,
      significantEarthquakes: earthquakes.filter(quake => 
        quake.properties && quake.properties.mag >= 5.0
      ).length
    };
  };

  const stats = getStats();

  const renderTabContent = () => {
    switch(activeTab) {
      case 'map':
        return (
          <div className="h-[600px]">
            <DisasterMap height="600px" />
          </div>
        );
      case 'earthquakes':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Earthquakes</h2>
            {earthquakes.length === 0 ? (
              <p>No earthquake data available.</p>
            ) : (
              <div className="grid gap-4">
                {earthquakes
                  .filter(quake => quake.properties)
                  .sort((a, b) => 
                    (b.properties.time || 0) - (a.properties.time || 0)
                  )
                  .slice(0, 10)
                  .map((quake, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">
                            Magnitude {(quake.properties.mag || 0).toFixed(1)} Earthquake
                          </h3>
                          <p>{quake.properties.place || 'Unknown location'}</p>
                          <p className="text-sm text-gray-600">
                            {quake.properties.time ? 
                              new Date(quake.properties.time).toLocaleString() : 
                              'Time unknown'}
                          </p>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                          (quake.properties.mag || 0) >= 6.0 ? 'bg-red-600' : 
                          (quake.properties.mag || 0) >= 5.0 ? 'bg-orange-500' : 
                          (quake.properties.mag || 0) >= 4.0 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}>
                          {(quake.properties.mag || 0).toFixed(1)}
                        </div>
                      </div>
                      {quake.properties.url && (
                        <div className="mt-2">
                          <a 
                            href={quake.properties.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            More details
                          </a>
                        </div>
                      )}
                    </Card>
                  ))}
              </div>
            )}
          </div>
        );
      case 'wildfires':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Active Wildfires</h2>
            {wildfires.length === 0 ? (
              <p>No wildfire data available.</p>
            ) : (
              <div className="grid gap-4">
                {wildfires.map((fire, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{fire.name}</h3>
                        <p>
                          Status: <span className={`font-medium ${
                            fire.status === 'Active' ? 'text-red-600' : 
                            fire.status === 'Contained' ? 'text-green-600' : 'text-orange-500'
                          }`}>{fire.status}</span>
                        </p>
                        <p>Area affected: {fire.area}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      case 'floods':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Flood Warnings</h2>
            {floods.length === 0 ? (
              <p>No flood warning data available.</p>
            ) : (
              <div className="grid gap-4">
                {floods.map((flood, index) => (
                  <Card key={index} className="p-4">
                    <div>
                      <h3 className="font-semibold">{flood.region}</h3>
                      <p>
                        Warning Level: <span className={`font-medium ${
                          flood.level === 'Major' ? 'text-red-600' : 
                          flood.level === 'Moderate' ? 'text-orange-500' : 'text-yellow-600'
                        }`}>{flood.level}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Expires: {new Date(flood.expires).toLocaleString()}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return <div>Select a tab to view disaster information</div>;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Disaster Tracker</h1>
      
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 p-4">
          <h3 className="text-lg font-semibold mb-1">Total Disasters</h3>
          <p className="text-3xl font-bold">{stats.totalCount}</p>
        </Card>
        <Card className="bg-red-50 p-4">
          <h3 className="text-lg font-semibold mb-1">Earthquakes</h3>
          <p className="text-3xl font-bold">{stats.earthquakeCount}</p>
          <p className="text-sm mt-1">{stats.significantEarthquakes} significant (M5.0+)</p>
        </Card>
        <Card className="bg-orange-50 p-4">
          <h3 className="text-lg font-semibold mb-1">Wildfires</h3>
          <p className="text-3xl font-bold">{stats.wildfireCount}</p>
        </Card>
        <Card className="bg-blue-50 p-4">
          <h3 className="text-lg font-semibold mb-1">Flood Warnings</h3>
          <p className="text-3xl font-bold">{stats.floodCount}</p>
        </Card>
      </div>
      
      {/* Error Message */}
      {error && <Alert type="error" message={error} className="mb-4" />}
      
      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading disaster data...</p>
        </div>
      ) : (
        <>
          {/* Tab Navigation */}
          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'map' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('map')}
            >
              Map View
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'earthquakes' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('earthquakes')}
            >
              Earthquakes
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'wildfires' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('wildfires')}
            >
              Wildfires
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'floods' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('floods')}
            >
              Flood Warnings
            </button>
          </div>
          
          {/* Tab Content */}
          {renderTabContent()}
          
          {/* Refresh Button */}
          <div className="mt-6 flex justify-center">
            <Button onClick={fetchDisasterData}>
              Refresh Data
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default DisasterTracker;