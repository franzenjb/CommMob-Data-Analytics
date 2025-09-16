import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import dataService from '../services/dataService';

// Fix for default marker icon not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Maps = () => {
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapType, setMapType] = useState('volunteers');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadMapData();
  }, [mapType]);

  useEffect(() => {
    filterMapData();
  }, [mapData, statusFilter]);

  const loadMapData = async () => {
    try {
      setLoading(true);
      let data;
      
      if (mapType === 'volunteers') {
        data = await dataService.getVolunteerData();
      } else {
        data = await dataService.getApplicantData();
      }
      
      // Process data for mapping
      const processedData = data
        .filter(item => item.x && item.y && !isNaN(parseFloat(item.x)) && !isNaN(parseFloat(item.y)))
        .map(item => ({
          id: item.ObjectId || Math.random(),
          lat: parseFloat(item.y),
          lng: parseFloat(item.x),
          status: item['Current Status'],
          name: item['Chapter Name'] || item.City || 'Unknown',
          state: item.State,
          position: item['Current Positions'] || item['Workflow Type'],
          lastLogin: item['Last Login'],
          applicationDate: item['Application Dt']
        }));
      
      setMapData(processedData);
      console.log(`Loaded ${processedData.length} ${mapType} for mapping`);
    } catch (err) {
      setError(`Failed to load ${mapType} data`);
      console.error(`Error loading ${mapType}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const filterMapData = () => {
    // This will be handled by the filteredData variable
  };

  const getMarkerColor = (status) => {
    switch (status) {
      case 'General Volunteer': return '#DC143C';
      case 'Prospective Volunteer': return '#1B365D';
      case 'Youth Under 18': return '#F7F7F7';
      case 'Employee': return '#FFD700';
      case 'Event Based Volunteer': return '#32CD32';
      case 'Inactive Prospective Volunteer': return '#FF6347';
      case 'Lapsed Volunteer': return '#A9A9A9';
      default: return '#666';
    }
  };

  const getMarkerSize = (status) => {
    switch (status) {
      case 'General Volunteer': return 8;
      case 'Prospective Volunteer': return 6;
      case 'Employee': return 10;
      default: return 5;
    }
  };

  const filteredData = statusFilter === 'all' 
    ? mapData 
    : mapData.filter(item => item.status === statusFilter);

  const uniqueStatuses = [...new Set(mapData.map(item => item.status))].filter(Boolean);
  const statusCounts = uniqueStatuses.reduce((acc, status) => {
    acc[status] = mapData.filter(item => item.status === status).length;
    return acc;
  }, {});

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading map data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Geographic Distribution
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Interactive map showing {mapData.length.toLocaleString()} {mapType} across {new Set(mapData.map(item => item.state)).size} states.
      </Typography>

      {/* Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Data Type</InputLabel>
                <Select
                  value={mapType}
                  onChange={(e) => setMapType(e.target.value)}
                  label="Data Type"
                >
                  <MenuItem value="volunteers">Volunteers</MenuItem>
                  <MenuItem value="applicants">Applicants</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status Filter"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  {uniqueStatuses.map(status => (
                    <MenuItem key={status} value={status}>
                      {status} ({statusCounts[status]})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label={`${filteredData.length} visible`} color="primary" variant="outlined" />
                <Chip label={`${new Set(filteredData.map(item => item.state)).size} states`} color="secondary" variant="outlined" />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            {mapType === 'volunteers' ? 'Volunteer' : 'Applicant'} Distribution Map
          </Typography>
          
          <Box sx={{ height: 600, borderRadius: 1, overflow: 'hidden' }}>
            <MapContainer
              center={[39.8283, -98.5795]} // Center of US
              zoom={4}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {filteredData.map((item, index) => (
                <CircleMarker
                  key={index}
                  center={[item.lat, item.lng]}
                  radius={getMarkerSize(item.status)}
                  color={getMarkerColor(item.status)}
                  fillColor={getMarkerColor(item.status)}
                  fillOpacity={0.7}
                  weight={2}
                >
                  <Popup>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: {item.status}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        State: {item.state}
                      </Typography>
                      {item.position && (
                        <Typography variant="body2" color="text.secondary">
                          Position: {item.position}
                        </Typography>
                      )}
                      {item.lastLogin && (
                        <Typography variant="body2" color="text.secondary">
                          Last Login: {item.lastLogin}
                        </Typography>
                      )}
                      {item.applicationDate && (
                        <Typography variant="body2" color="text.secondary">
                          Application Date: {new Date(item.applicationDate).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </Box>

          {/* Legend */}
          <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Status Legend:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {uniqueStatuses.map(status => (
                <Chip
                  key={status}
                  label={status}
                  size="small"
                  sx={{
                    backgroundColor: getMarkerColor(status),
                    color: 'white',
                    '& .MuiChip-label': {
                      color: 'white'
                    }
                  }}
                />
              ))}
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Maps;