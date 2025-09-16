import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useState } from 'react';

const Analytics = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Advanced Analytics
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Comprehensive data analysis with interactive charts, trends, and statistical insights.
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Trends" />
          <Tab label="Distribution" />
          <Tab label="Correlations" />
          <Tab label="Performance" />
        </Tabs>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Analysis Controls
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Time Period</InputLabel>
                <Select defaultValue="ytd">
                  <MenuItem value="ytd">Year to Date</MenuItem>
                  <MenuItem value="12m">Last 12 Months</MenuItem>
                  <MenuItem value="6m">Last 6 Months</MenuItem>
                  <MenuItem value="3m">Last 3 Months</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth size="small">
                <InputLabel>Metric</InputLabel>
                <Select defaultValue="applications">
                  <MenuItem value="applications">Applications</MenuItem>
                  <MenuItem value="conversions">Conversions</MenuItem>
                  <MenuItem value="retention">Retention</MenuItem>
                  <MenuItem value="activity">Activity</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3, height: 500 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {tabValue === 0 && 'Application Trends Over Time'}
              {tabValue === 1 && 'Volunteer Status Distribution'}
              {tabValue === 2 && 'Geographic Correlation Analysis'}
              {tabValue === 3 && 'Performance Metrics'}
            </Typography>
            <Box 
              sx={{ 
                height: 400, 
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
                Interactive Plotly chart will be rendered here
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
