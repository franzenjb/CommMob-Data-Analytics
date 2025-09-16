import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  People,
  Assignment,
  Map,
  TrendingUp
} from '@mui/icons-material';

import MetricCard from '../components/Dashboard/MetricCard';
import InteractiveMap from '../components/Map/InteractiveMap';
import DataChart from '../components/Charts/DataChart';
import AIInsightsPanel from '../components/AI/AIInsightsPanel';
import ThreeDVisualization from '../components/Visualizations/ThreeDVisualization';
import dataService from '../services/dataService';

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [mapData, setMapData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardMetrics, geographicData, analyticsData] = await Promise.all([
        dataService.getDashboardMetrics(),
        dataService.getGeographicData(),
        dataService.getAnalyticsData()
      ]);

      // Transform metrics data
      const metricsData = [
        {
          title: 'Total Volunteers',
          value: dashboardMetrics.totalVolunteers.toLocaleString(),
          change: '+12.5%',
          changeType: 'up',
          subtitle: 'Active volunteers',
          icon: <People sx={{ fontSize: 32 }} />,
          color: 'primary'
        },
        {
          title: 'New Applicants',
          value: dashboardMetrics.totalApplicants.toLocaleString(),
          change: '+8.2%',
          changeType: 'up',
          subtitle: 'This year',
          icon: <Assignment sx={{ fontSize: 32 }} />,
          color: 'info'
        },
        {
          title: 'Geographic Coverage',
          value: dashboardMetrics.geographicCoverage.toString(),
          change: '+3',
          changeType: 'up',
          subtitle: 'States covered',
          icon: <Map sx={{ fontSize: 32 }} />,
          color: 'success'
        },
        {
          title: 'Conversion Rate',
          value: `${dashboardMetrics.conversionRate}%`,
          change: '+2.1%',
          changeType: 'up',
          subtitle: 'Application to volunteer',
          icon: <TrendingUp sx={{ fontSize: 32 }} />,
          color: 'warning'
        }
      ];

      setMetrics(metricsData);
      setMapData(geographicData);
      setChartData(analyticsData.statusDistribution);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading advanced analytics...
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
        Advanced Analytics Dashboard
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Comprehensive analytics powered by Cloudflare AI, 3D visualizations, and real-time data processing.
      </Typography>

      {/* AI Insights Panel */}
      <AIInsightsPanel 
        metrics={metrics.reduce((acc, metric) => {
          acc[metric.title.toLowerCase().replace(/\s+/g, '_')] = metric.value;
          return acc;
        }, {})}
        onInsightsGenerated={(insights) => console.log('AI Insights:', insights)}
      />

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>

      {/* Main Visualizations */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <InteractiveMap 
            data={mapData} 
            mapType="volunteers" 
            height={400}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <DataChart 
            data={chartData}
            type="pie"
            title="Volunteer Status Distribution"
            height={300}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ThreeDVisualization 
            data={mapData}
            visualizationType="network"
            title="3D Volunteer Network"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DataChart 
            data={chartData}
            type="bar"
            title="Geographic Distribution"
            height={400}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
