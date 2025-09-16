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
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import Plot from 'react-plotly.js';
import dataService from '../../services/dataService';

const BiomedChart = () => {
  const [biomedData, setBiomedData] = useState(null);
  const [geographicData, setGeographicData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('status');

  useEffect(() => {
    loadBiomedData();
  }, []);

  const loadBiomedData = async () => {
    try {
      setLoading(true);
      const [analytics, geographic] = await Promise.all([
        dataService.getBiomedAnalytics(),
        dataService.getBiomedGeographicData()
      ]);
      
      setBiomedData(analytics);
      setGeographicData(geographic);
    } catch (error) {
      console.error('Error loading biomed data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusDistributionChart = () => {
    if (!biomedData) return null;

    const data = [{
      x: Object.keys(biomedData.statusDistribution),
      y: Object.values(biomedData.statusDistribution),
      type: 'bar',
      marker: {
        color: ['#DC143C', '#FF6B6B', '#FF8E8E', '#FFB3B3', '#FFD4D4'],
        line: { color: '#1B365D', width: 1 }
      },
      text: Object.values(biomedData.statusDistribution).map(count => 
        `${count} drives`
      ),
      textposition: 'auto'
    }];

    const layout = {
      title: {
        text: 'Blood Drive Status Distribution',
        font: { family: 'Georgia, serif', size: 16, color: '#1B365D' }
      },
      xaxis: {
        title: 'Status',
        titlefont: { family: 'Georgia, serif', size: 12, color: '#1B365D' }
      },
      yaxis: {
        title: 'Number of Drives',
        titlefont: { family: 'Georgia, serif', size: 12, color: '#1B365D' }
      },
      font: { family: 'Georgia, serif', size: 12, color: '#1B365D' },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      margin: { l: 60, r: 30, t: 60, b: 60 }
    };

    return <Plot data={data} layout={layout} style={{ width: '100%', height: '400px' }} />;
  };

  const getAccountTypeChart = () => {
    if (!biomedData) return null;

    const data = [{
      labels: Object.keys(biomedData.accountTypeDistribution),
      values: Object.values(biomedData.accountTypeDistribution),
      type: 'pie',
      marker: {
        colors: ['#DC143C', '#FF6B6B', '#FF8E8E', '#FFB3B3', '#FFD4D4', '#FFE6E6']
      },
      textinfo: 'label+percent',
      textfont: { family: 'Georgia, serif', size: 12, color: '#1B365D' }
    }];

    const layout = {
      title: {
        text: 'Blood Drive Account Types',
        font: { family: 'Georgia, serif', size: 16, color: '#1B365D' }
      },
      font: { family: 'Georgia, serif', size: 12, color: '#1B365D' },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      margin: { l: 30, r: 30, t: 60, b: 30 },
      showlegend: true,
      legend: {
        orientation: 'v',
        x: 1.05,
        y: 0.5
      }
    };

    return <Plot data={data} layout={layout} style={{ width: '100%', height: '400px' }} />;
  };

  const getYearDistributionChart = () => {
    if (!biomedData) return null;

    const data = [{
      x: Object.keys(biomedData.yearDistribution),
      y: Object.values(biomedData.yearDistribution),
      type: 'bar',
      marker: {
        color: '#DC143C',
        line: { color: '#1B365D', width: 1 }
      },
      text: Object.values(biomedData.yearDistribution).map(count => 
        `${count} drives`
      ),
      textposition: 'auto'
    }];

    const layout = {
      title: {
        text: 'Blood Drives by Year',
        font: { family: 'Georgia, serif', size: 16, color: '#1B365D' }
      },
      xaxis: {
        title: 'Year',
        titlefont: { family: 'Georgia, serif', size: 12, color: '#1B365D' }
      },
      yaxis: {
        title: 'Number of Drives',
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
        size: geographicData.map(d => Math.max(5, Math.min(20, d.productsCollected / 10))),
        color: geographicData.map(d => d.productsCollected),
        colorscale: 'Reds',
        colorbar: {
          title: 'Products Collected',
          titlefont: { family: 'Georgia, serif', size: 12, color: '#1B365D' }
        },
        line: { color: '#1B365D', width: 1 },
        opacity: 0.7
      },
      text: geographicData.map(d => 
        `${d.accountName}<br>Products: ${d.productsCollected}<br>Status: ${d.status}`
      ),
      hovertemplate: '<b>%{text}</b><br>' +
                    'Longitude: %{x}<br>' +
                    'Latitude: %{y}<extra></extra>'
    }];

    const layout = {
      title: {
        text: 'Blood Drive Geographic Distribution',
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

  const getTopPerformingDrives = () => {
    if (!geographicData.length) return null;

    const topDrives = [...geographicData]
      .sort((a, b) => b.productsCollected - a.productsCollected)
      .slice(0, 10);

    return (
      <TableContainer component={Paper} sx={{ backgroundColor: '#FAFAFA' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontFamily: 'Georgia, serif', fontWeight: 'bold', color: '#1B365D' }}>
                Account Name
              </TableCell>
              <TableCell sx={{ fontFamily: 'Georgia, serif', fontWeight: 'bold', color: '#1B365D' }}>
                Type
              </TableCell>
              <TableCell sx={{ fontFamily: 'Georgia, serif', fontWeight: 'bold', color: '#1B365D' }}>
                Products Collected
              </TableCell>
              <TableCell sx={{ fontFamily: 'Georgia, serif', fontWeight: 'bold', color: '#1B365D' }}>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topDrives.map((drive, index) => (
              <TableRow key={drive.id}>
                <TableCell sx={{ fontFamily: 'Georgia, serif' }}>
                  {drive.accountName}
                </TableCell>
                <TableCell sx={{ fontFamily: 'Georgia, serif' }}>
                  <Chip 
                    label={drive.accountType}
                    size="small"
                    sx={{ fontFamily: 'Georgia, serif' }}
                  />
                </TableCell>
                <TableCell sx={{ fontFamily: 'Georgia, serif' }}>
                  <Chip 
                    label={drive.productsCollected}
                    color="error"
                    size="small"
                    sx={{ fontFamily: 'Georgia, serif', fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell sx={{ fontFamily: 'Georgia, serif' }}>
                  <Chip 
                    label={drive.status}
                    color={drive.status === 'Complete' ? 'success' : 'warning'}
                    size="small"
                    sx={{ fontFamily: 'Georgia, serif' }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', color: '#1B365D' }}>
          Loading blood drive data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontFamily: 'Georgia, serif', color: '#1B365D' }}>
        Blood Drive Analytics
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#FFF5F5', border: '1px solid #DC143C' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', color: '#1B365D' }}>
                Total Drives
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: 'Georgia, serif', color: '#DC143C', fontWeight: 'bold' }}>
                {geographicData.length.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#FFF5F5', border: '1px solid #DC143C' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', color: '#1B365D' }}>
                Products Collected
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: 'Georgia, serif', color: '#DC143C', fontWeight: 'bold' }}>
                {biomedData ? biomedData.totalProductsCollected.toLocaleString() : '0'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#FFF5F5', border: '1px solid #DC143C' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', color: '#1B365D' }}>
                Avg per Drive
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: 'Georgia, serif', color: '#DC143C', fontWeight: 'bold' }}>
                {biomedData ? (biomedData.totalProductsCollected / geographicData.length).toFixed(1) : '0'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#FFF5F5', border: '1px solid #DC143C' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', color: '#1B365D' }}>
                Completion Rate
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: 'Georgia, serif', color: '#DC143C', fontWeight: 'bold' }}>
                {biomedData && biomedData.statusDistribution.Complete ? 
                  ((biomedData.statusDistribution.Complete / geographicData.length) * 100).toFixed(1) + '%' : 
                  '0%'
                }
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
            <MenuItem value="status" sx={{ fontFamily: 'Georgia, serif' }}>
              Status Distribution
            </MenuItem>
            <MenuItem value="accountType" sx={{ fontFamily: 'Georgia, serif' }}>
              Account Types
            </MenuItem>
            <MenuItem value="year" sx={{ fontFamily: 'Georgia, serif' }}>
              Year Distribution
            </MenuItem>
            <MenuItem value="geographic" sx={{ fontFamily: 'Georgia, serif' }}>
              Geographic Map
            </MenuItem>
            <MenuItem value="topDrives" sx={{ fontFamily: 'Georgia, serif' }}>
              Top Performing Drives
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Charts */}
      <Grid container spacing={3}>
        {selectedView === 'status' && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, backgroundColor: '#FAFAFA' }}>
              {getStatusDistributionChart()}
            </Paper>
          </Grid>
        )}

        {selectedView === 'accountType' && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, backgroundColor: '#FAFAFA' }}>
              {getAccountTypeChart()}
            </Paper>
          </Grid>
        )}

        {selectedView === 'year' && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, backgroundColor: '#FAFAFA' }}>
              {getYearDistributionChart()}
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

        {selectedView === 'topDrives' && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, backgroundColor: '#FAFAFA' }}>
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Georgia, serif', color: '#1B365D' }}>
                Top 10 Performing Blood Drives
              </Typography>
              {getTopPerformingDrives()}
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default BiomedChart;
