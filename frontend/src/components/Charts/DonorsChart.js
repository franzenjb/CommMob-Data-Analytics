import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import Plot from 'react-plotly.js';
import dataService from '../../services/dataService';

const DonorsChart = () => {
  const [donorsData, setDonorsData] = useState(null);
  const [geographicData, setGeographicData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('distribution');

  useEffect(() => {
    loadDonorsData();
  }, []);

  const loadDonorsData = async () => {
    try {
      setLoading(true);
      const [analytics, geographic] = await Promise.all([
        dataService.getDonorAnalytics(),
        dataService.getDonorsGeographicData()
      ]);
      
      setDonorsData(analytics);
      setGeographicData(geographic);
    } catch (error) {
      console.error('Error loading donors data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getGiftDistributionChart = () => {
    if (!donorsData) return null;

    const data = [{
      x: Object.keys(donorsData.giftDistribution),
      y: Object.values(donorsData.giftDistribution),
      type: 'bar',
      marker: {
        color: ['#DC143C', '#FF6B6B', '#FF8E8E', '#FFB3B3'],
        line: { color: '#1B365D', width: 1 }
      },
      text: Object.values(donorsData.giftDistribution).map(count => 
        `${count} donors`
      ),
      textposition: 'auto'
    }];

    const layout = {
      title: {
        text: 'Donor Gift Amount Distribution',
        font: { family: 'Georgia, serif', size: 16, color: '#1B365D' }
      },
      xaxis: {
        title: 'Gift Amount Range',
        titlefont: { family: 'Georgia, serif', size: 12, color: '#1B365D' }
      },
      yaxis: {
        title: 'Number of Donors',
        titlefont: { family: 'Georgia, serif', size: 12, color: '#1B365D' }
      },
      font: { family: 'Georgia, serif', size: 12, color: '#1B365D' },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      margin: { l: 60, r: 30, t: 60, b: 60 }
    };

    return <Plot data={data} layout={layout} style={{ width: '100%', height: '400px' }} />;
  };

  const getGeographicMap = () => {
    if (geographicData.length === 0) return null;

    // Create scatter plot for geographic distribution
    const data = [{
      x: geographicData.map(d => d.coordinates[1]), // longitude
      y: geographicData.map(d => d.coordinates[0]), // latitude
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: geographicData.map(d => Math.max(5, Math.min(20, d.giftAmount / 5000))),
        color: geographicData.map(d => d.giftAmount),
        colorscale: 'Reds',
        colorbar: {
          title: 'Gift Amount ($)',
          titlefont: { family: 'Georgia, serif', size: 12, color: '#1B365D' }
        },
        line: { color: '#1B365D', width: 1 },
        opacity: 0.7
      },
      text: geographicData.map(d => 
        `Gift Amount: ${formatCurrency(d.giftAmount)}`
      ),
      hovertemplate: '<b>%{text}</b><br>' +
                    'Longitude: %{x}<br>' +
                    'Latitude: %{y}<extra></extra>'
    }];

    const layout = {
      title: {
        text: 'Donor Geographic Distribution',
        font: { family: 'Georgia, serif', size: 16, color: '#1B365D' }
      },
      xaxis: {
        title: 'Longitude',
        titlefont: { family: 'Georgia, serif', size: 12, color: '#1B365D' }
      },
      yaxis: {
        title: 'Latitude',
        titlefont: { family: 'Georgia, serif', size: 12, color: '#1B365D' }
      },
      font: { family: 'Georgia, serif', size: 12, color: '#1B365D' },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      margin: { l: 60, r: 30, t: 60, b: 60 }
    };

    return <Plot data={data} layout={layout} style={{ width: '100%', height: '500px' }} />;
  };

  const getTopDonorsTable = () => {
    if (!geographicData.length) return null;

    const topDonors = [...geographicData]
      .sort((a, b) => b.giftAmount - a.giftAmount)
      .slice(0, 10);

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Georgia, serif', color: '#1B365D' }}>
          Top 10 Donors
        </Typography>
        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
          {topDonors.map((donor, index) => (
            <Box 
              key={donor.id} 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                py: 1,
                borderBottom: index < topDonors.length - 1 ? '1px solid #E0E0E0' : 'none'
              }}
            >
              <Typography variant="body2" sx={{ fontFamily: 'Georgia, serif' }}>
                #{index + 1}
              </Typography>
              <Chip 
                label={formatCurrency(donor.giftAmount)}
                color="error"
                size="small"
                sx={{ fontFamily: 'Georgia, serif', fontWeight: 'bold' }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', color: '#1B365D' }}>
          Loading donors data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontFamily: 'Georgia, serif', color: '#1B365D' }}>
        Donors Analytics
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#FFF5F5', border: '1px solid #DC143C' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', color: '#1B365D' }}>
                Total Donations
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: 'Georgia, serif', color: '#DC143C', fontWeight: 'bold' }}>
                {donorsData ? formatCurrency(donorsData.totalDonations) : '$0'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#FFF5F5', border: '1px solid #DC143C' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', color: '#1B365D' }}>
                Average Gift
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: 'Georgia, serif', color: '#DC143C', fontWeight: 'bold' }}>
                {donorsData ? formatCurrency(donorsData.averageGift) : '$0'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#FFF5F5', border: '1px solid #DC143C' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', color: '#1B365D' }}>
                Top Gift
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: 'Georgia, serif', color: '#DC143C', fontWeight: 'bold' }}>
                {donorsData ? formatCurrency(donorsData.topGift) : '$0'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#FFF5F5', border: '1px solid #DC143C' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', color: '#1B365D' }}>
                Total Donors
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: 'Georgia, serif', color: '#DC143C', fontWeight: 'bold' }}>
                {geographicData.length.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* View Selector */}
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel sx={{ fontFamily: 'Georgia, serif', color: '#1B365D' }}>
            View
          </InputLabel>
          <Select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            label="View"
            sx={{ fontFamily: 'Georgia, serif' }}
          >
            <MenuItem value="distribution" sx={{ fontFamily: 'Georgia, serif' }}>
              Gift Distribution
            </MenuItem>
            <MenuItem value="geographic" sx={{ fontFamily: 'Georgia, serif' }}>
              Geographic Map
            </MenuItem>
            <MenuItem value="topDonors" sx={{ fontFamily: 'Georgia, serif' }}>
              Top Donors
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Charts */}
      <Grid container spacing={3}>
        {selectedView === 'distribution' && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, backgroundColor: '#FAFAFA' }}>
              {getGiftDistributionChart()}
            </Paper>
          </Grid>
        )}

        {selectedView === 'geographic' && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, backgroundColor: '#FAFAFA' }}>
              {getGeographicMap()}
            </Paper>
          </Grid>
        )}

        {selectedView === 'topDonors' && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, backgroundColor: '#FAFAFA' }}>
              {getTopDonorsTable()}
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DonorsChart;
