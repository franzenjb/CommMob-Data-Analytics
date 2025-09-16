import React from 'react';
import {
  Grid,
  Typography,
  Box,
  Paper
} from '@mui/material';
import {
  People,
  Assignment,
  Map,
  TrendingUp
} from '@mui/icons-material';

import MetricCard from '../components/Dashboard/MetricCard';

const Dashboard = () => {
  const metrics = [
    {
      title: 'Total Volunteers',
      value: '49,247',
      change: '+12.5%',
      changeType: 'up',
      subtitle: 'Active volunteers',
      icon: <People sx={{ fontSize: 32 }} />,
      color: 'primary'
    },
    {
      title: 'New Applicants',
      value: '76,384',
      change: '+8.2%',
      changeType: 'up',
      subtitle: 'This year',
      icon: <Assignment sx={{ fontSize: 32 }} />,
      color: 'info'
    },
    {
      title: 'Geographic Coverage',
      value: '47',
      change: '+3',
      changeType: 'up',
      subtitle: 'States covered',
      icon: <Map sx={{ fontSize: 32 }} />,
      color: 'success'
    },
    {
      title: 'Conversion Rate',
      value: '64.5%',
      change: '+2.1%',
      changeType: 'up',
      subtitle: 'Application to volunteer',
      icon: <TrendingUp sx={{ fontSize: 32 }} />,
      color: 'warning'
    }
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Dashboard Overview
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Comprehensive analytics for American Red Cross volunteer management and organizational insights.
      </Typography>

      <Grid container spacing={3}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard {...metric} />
          </Grid>
        ))}
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Volunteer Distribution Map
            </Typography>
            <Box 
              sx={{ 
                height: 300, 
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
                Interactive map will be rendered here
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Application Pipeline
            </Typography>
            <Box 
              sx={{ 
                height: 300, 
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
                Pipeline chart will be rendered here
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
