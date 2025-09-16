import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack
} from '@mui/material';

const Maps = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Interactive Maps
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Geographic analysis of volunteer distribution, application patterns, and regional insights.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Map Controls
            </Typography>
            
            <Stack spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Map Type</InputLabel>
                <Select defaultValue="volunteers">
                  <MenuItem value="volunteers">Volunteer Distribution</MenuItem>
                  <MenuItem value="applicants">Application Density</MenuItem>
                  <MenuItem value="conversion">Conversion Rates</MenuItem>
                  <MenuItem value="heatmap">Activity Heatmap</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth size="small">
                <InputLabel>Region</InputLabel>
                <Select defaultValue="all">
                  <MenuItem value="all">All Regions</MenuItem>
                  <MenuItem value="texas">Texas</MenuItem>
                  <MenuItem value="nevada">Nevada</MenuItem>
                  <MenuItem value="utah">Utah</MenuItem>
                </Select>
              </FormControl>
              
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Data Layers
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label="Volunteers" size="small" color="primary" />
                  <Chip label="Applicants" size="small" />
                  <Chip label="Chapters" size="small" />
                  <Chip label="Service Areas" size="small" />
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3, height: 600 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Volunteer Geographic Distribution
            </Typography>
            <Box 
              sx={{ 
                height: 500, 
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
                Interactive Leaflet map will be rendered here
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Maps;
