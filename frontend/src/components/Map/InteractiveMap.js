import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Box, Typography, Chip, Paper } from '@mui/material';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom marker icon for Red Cross
const createRedCrossIcon = (status) => {
  const color = status === 'General Volunteer' ? '#DC143C' : 
                status === 'Prospective Volunteer' ? '#1B365D' : '#666';
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="
      background-color: ${color};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
      font-weight: bold;
    ">+</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const MapComponent = ({ data, mapType }) => {
  const mapRef = useRef();
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (map && data.length > 0) {
      const group = new L.featureGroup();
      
      data.forEach(item => {
        if (item.coordinates && item.coordinates.length === 2) {
          const marker = L.marker(item.coordinates, {
            icon: createRedCrossIcon(item.status)
          });
          
          marker.bindPopup(`
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: #DC143C; font-family: Georgia, serif;">${item.name}</h3>
              <p style="margin: 4px 0;"><strong>Status:</strong> ${item.status}</p>
              <p style="margin: 4px 0;"><strong>State:</strong> ${item.state}</p>
              <p style="margin: 4px 0;"><strong>Position:</strong> ${item.position || 'N/A'}</p>
              <p style="margin: 4px 0;"><strong>Zip:</strong> ${item.zip || 'N/A'}</p>
            </div>
          `);
          
          group.addLayer(marker);
        }
      });
      
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [map, data]);

  return (
    <MapContainer
      center={[39.8283, -98.5795]} // Center of US
      zoom={4}
      style={{ height: '100%', width: '100%' }}
      whenCreated={setMap}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {data.map((item, index) => (
        item.coordinates && item.coordinates.length === 2 && (
          <Marker
            key={index}
            position={item.coordinates}
            icon={createRedCrossIcon(item.status)}
          >
            <Popup>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="h6" sx={{ color: 'primary.main', mb: 1, fontFamily: 'Georgia, serif' }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Status:</strong> {item.status}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>State:</strong> {item.state}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Position:</strong> {item.position || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Zip:</strong> {item.zip || 'N/A'}
                </Typography>
              </Box>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};

const InteractiveMap = ({ data, mapType = 'volunteers', height = 500 }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data && data.length > 0) {
      setLoading(false);
    }
  }, [data]);

  if (loading) {
    return (
      <Box 
        sx={{ 
          height, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'grey.50',
          borderRadius: 1,
          border: '2px dashed',
          borderColor: 'grey.300'
        }}
      >
        <Typography color="text.secondary">
          Loading map data...
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2, height }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {mapType === 'volunteers' ? 'Volunteer Distribution' : 'Application Density'}
        </Typography>
        <Chip 
          label={`${data.length} locations`} 
          color="primary" 
          size="small" 
        />
      </Box>
      
      <Box sx={{ height: height - 80, borderRadius: 1, overflow: 'hidden' }}>
        <MapComponent data={data} mapType={mapType} />
      </Box>
    </Paper>
  );
};

export default InteractiveMap;
