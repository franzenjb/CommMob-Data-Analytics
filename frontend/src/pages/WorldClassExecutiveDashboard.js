import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, IconButton, TextField,
  Select, MenuItem, FormControl, InputLabel, Button, Chip, Avatar,
  LinearProgress, Alert, Tabs, Tab, Paper, Divider, Stack,
  ToggleButton, ToggleButtonGroup, Tooltip, Fab, Dialog, DialogTitle,
  DialogContent, DialogActions, InputAdornment
} from '@mui/material';
import {
  Dashboard, Map, ShowChart, People, BloodtypeOutlined,
  AttachMoney, TrendingUp, Analytics, Search, FilterList,
  Download, Share, Refresh, Settings, AutoAwesome,
  LocationOn, Timeline, PieChart, BarChart, Speed,
  Warning, CheckCircle, Info, NavigateBefore, NavigateNext,
  Fullscreen, ZoomIn, ZoomOut, Layers, ChatBubbleOutline
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, HeatmapLayer, CircleMarker } from 'react-leaflet';
import Plot from 'react-plotly.js';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { format } from 'date-fns';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const WorldClassExecutiveDashboard = () => {
  // State management
  const [selectedTab, setSelectedTab] = useState(0);
  const [kpis, setKpis] = useState(null);
  const [chartData, setChartData] = useState({});
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    region: 'all',
    status: 'all'
  });
  const [viewMode, setViewMode] = useState('dashboard');
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [insights, setInsights] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch KPIs
      const kpisResponse = await axios.get('http://localhost:5000/api/kpis');
      setKpis(kpisResponse.data);

      // Fetch chart data
      const chartTypes = ['volunteer_timeline', 'geographic_heatmap', 'conversion_funnel', 
                         'blood_drive_trends', 'donor_distribution'];
      const chartPromises = chartTypes.map(type => 
        axios.get(`http://localhost:5000/api/charts/${type}`)
      );
      const chartResponses = await Promise.all(chartPromises);
      const newChartData = {};
      chartTypes.forEach((type, index) => {
        newChartData[type] = chartResponses[index].data;
      });
      setChartData(newChartData);

      // Fetch insights
      const insightsResponse = await axios.get('http://localhost:5000/api/insights');
      setInsights(insightsResponse.data.insights);

      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
      console.error(err);
    }
  };

  const handleAIQuery = async () => {
    if (!aiQuery) return;
    
    try {
      const response = await axios.post('http://localhost:5000/api/ai/analyze', {
        query: aiQuery
      });
      setAiResponse(response.data);
    } catch (err) {
      console.error('AI query failed:', err);
    }
  };

  const MetricCard = ({ title, value, change, icon: Icon, color, subtext }) => (
    <Card elevation={3} sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="caption">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
            {subtext && (
              <Typography variant="caption" color="textSecondary">
                {subtext}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            <Icon />
          </Avatar>
        </Box>
        {change !== undefined && (
          <Box mt={2} display="flex" alignItems="center">
            {change >= 0 ? (
              <TrendingUp color="success" fontSize="small" />
            ) : (
              <TrendingUp color="error" fontSize="small" sx={{ transform: 'rotate(180deg)' }} />
            )}
            <Typography
              variant="body2"
              color={change >= 0 ? 'success.main' : 'error.main'}
              ml={0.5}
            >
              {Math.abs(change)}% {change >= 0 ? 'increase' : 'decrease'}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderKPISection = () => {
    if (!kpis) return null;

    const metrics = [
      {
        title: 'Total Volunteers',
        value: kpis.volunteer_metrics?.total_volunteers || 0,
        change: 12,
        icon: People,
        color: 'primary.main',
        subtext: `${kpis.volunteer_metrics?.active_volunteers || 0} active`
      },
      {
        title: 'Total Raised',
        value: `$${((kpis.financial_metrics?.total_raised || 0) / 1000000).toFixed(1)}M`,
        change: 18,
        icon: AttachMoney,
        color: 'success.main',
        subtext: `${kpis.financial_metrics?.total_donors || 0} donors`
      },
      {
        title: 'Blood Drives',
        value: kpis.operational_metrics?.total_blood_drives || 0,
        change: 8,
        icon: BloodtypeOutlined,
        color: 'error.main',
        subtext: `${kpis.operational_metrics?.collection_efficiency?.toFixed(1)}% efficiency`
      },
      {
        title: 'Conversion Rate',
        value: `${kpis.volunteer_metrics?.conversion_rate || 0}%`,
        change: -3,
        icon: TrendingUp,
        color: 'warning.main',
        subtext: 'Applicant to volunteer'
      }
    ];

    return (
      <Grid container spacing={3}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderGeographicMap = () => {
    const mapCenter = [39.8283, -98.5795]; // Center of USA
    const heatmapData = chartData.geographic_heatmap || [];

    return (
      <Card elevation={3} sx={{ height: 600 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              Volunteer & Resource Distribution
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip label="Volunteers" color="primary" size="small" />
              <Chip label="Blood Drives" color="error" size="small" />
              <Chip label="Major Donors" color="success" size="small" />
            </Stack>
          </Box>
          <MapContainer
            center={mapCenter}
            zoom={4}
            style={{ height: '500px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {heatmapData.map((point, idx) => (
              <CircleMarker
                key={idx}
                center={[point.lat, point.lng]}
                radius={5}
                fillOpacity={0.8}
                color="red"
              />
            ))}
          </MapContainer>
        </CardContent>
      </Card>
    );
  };

  const renderVolunteerTimeline = () => {
    const data = chartData.volunteer_timeline || { labels: [], datasets: [] };
    
    const plotData = [{
      x: data.labels,
      y: data.datasets[0]?.data || [],
      type: 'scatter',
      mode: 'lines+markers',
      marker: { color: '#d32f2f', size: 8 },
      line: { color: '#d32f2f', width: 3 },
      fill: 'tozeroy',
      fillcolor: 'rgba(211, 47, 47, 0.1)',
      name: 'Applications'
    }];

    const layout = {
      title: 'Volunteer Application Trends',
      xaxis: { title: 'Month', showgrid: false },
      yaxis: { title: 'Applications', showgrid: true, gridcolor: '#f0f0f0' },
      height: 400,
      hovermode: 'x unified',
      showlegend: false,
      margin: { t: 40, r: 20, b: 60, l: 60 }
    };

    return (
      <Card elevation={3}>
        <CardContent>
          <Plot data={plotData} layout={layout} config={{ responsive: true }} />
        </CardContent>
      </Card>
    );
  };

  const renderConversionFunnel = () => {
    const data = chartData.conversion_funnel || { stages: [] };
    
    const plotData = [{
      type: 'funnel',
      y: data.stages.map(s => s.name),
      x: data.stages.map(s => s.value),
      textposition: 'auto',
      textinfo: 'value+percent initial',
      marker: {
        color: ['#d32f2f', '#f44336', '#ff5252', '#ff8a80']
      }
    }];

    const layout = {
      title: 'Volunteer Conversion Funnel',
      height: 400,
      margin: { t: 40, r: 20, b: 40, l: 100 }
    };

    return (
      <Card elevation={3}>
        <CardContent>
          <Plot data={plotData} layout={layout} config={{ responsive: true }} />
        </CardContent>
      </Card>
    );
  };

  const renderBloodDriveTrends = () => {
    const data = chartData.blood_drive_trends || { labels: [], datasets: [] };
    
    const plotData = [
      {
        x: data.labels,
        y: data.datasets[0]?.data || [],
        type: 'bar',
        name: 'Total Drives',
        marker: { color: '#d32f2f' }
      },
      {
        x: data.labels,
        y: data.datasets[1]?.data || [],
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Products Collected',
        yaxis: 'y2',
        marker: { color: '#ff5252', size: 10 },
        line: { color: '#ff5252', width: 3 }
      }
    ];

    const layout = {
      title: 'Blood Drive Performance Trends',
      xaxis: { title: 'Year' },
      yaxis: { title: 'Number of Drives', side: 'left' },
      yaxis2: { title: 'Products Collected', overlaying: 'y', side: 'right' },
      height: 400,
      showlegend: true,
      legend: { x: 0, y: 1 },
      margin: { t: 40, r: 60, b: 60, l: 60 }
    };

    return (
      <Card elevation={3}>
        <CardContent>
          <Plot data={plotData} layout={layout} config={{ responsive: true }} />
        </CardContent>
      </Card>
    );
  };

  const renderDonorDistribution = () => {
    const data = chartData.donor_distribution || { labels: [], datasets: [] };
    
    const plotData = [{
      values: data.datasets[0]?.data || [],
      labels: data.labels,
      type: 'pie',
      hole: 0.4,
      marker: {
        colors: ['#ffcdd2', '#ef9a9a', '#e57373', '#ef5350', '#f44336', '#e53935', '#d32f2f']
      },
      textposition: 'outside'
    }];

    const layout = {
      title: 'Major Donor Distribution by Gift Size',
      height: 400,
      showlegend: true,
      margin: { t: 40, r: 20, b: 40, l: 20 }
    };

    return (
      <Card elevation={3}>
        <CardContent>
          <Plot data={plotData} layout={layout} config={{ responsive: true }} />
        </CardContent>
      </Card>
    );
  };

  const renderAIInsights = () => (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          AI-Powered Insights & Analysis
        </Typography>
        <Box my={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask a question about your data... (e.g., 'What regions need more volunteers?')"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAIQuery()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleAIQuery} color="primary">
                    <AutoAwesome />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
        
        {aiResponse && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">{aiResponse.analysis}</Typography>
          </Alert>
        )}

        <Divider sx={{ my: 3 }} />
        
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Predictive Insights
        </Typography>
        <Stack spacing={2}>
          {insights.map((insight, index) => (
            <Alert 
              key={index} 
              severity={insight.type === 'warning' ? 'warning' : 'info'}
              icon={insight.confidence > 0.8 ? <CheckCircle /> : <Info />}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                {insight.prediction}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                Recommendation: {insight.recommendation}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={insight.confidence * 100} 
                sx={{ mt: 1 }}
              />
              <Typography variant="caption" color="textSecondary">
                Confidence: {(insight.confidence * 100).toFixed(0)}%
              </Typography>
            </Alert>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );

  const renderDashboard = () => (
    <Box>
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Red Cross Executive Command Center
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Real-time analytics and insights for strategic decision-making
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button 
                variant="outlined" 
                startIcon={<Download />}
                onClick={() => window.open('http://localhost:5000/api/export/csv', '_blank')}
              >
                Export Data
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<Share />}
              >
                Share Dashboard
              </Button>
              <IconButton onClick={fetchAllData} color="primary">
                <Refresh />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box mb={3}>
        {renderKPISection()}
      </Box>

      <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)} sx={{ mb: 3 }}>
        <Tab label="Overview" icon={<Dashboard />} iconPosition="start" />
        <Tab label="Geographic" icon={<Map />} iconPosition="start" />
        <Tab label="Volunteers" icon={<People />} iconPosition="start" />
        <Tab label="Blood Services" icon={<BloodtypeOutlined />} iconPosition="start" />
        <Tab label="Financials" icon={<AttachMoney />} iconPosition="start" />
        <Tab label="AI Insights" icon={<AutoAwesome />} iconPosition="start" />
      </Tabs>

      <Box>
        {selectedTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {renderVolunteerTimeline()}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderConversionFunnel()}
            </Grid>
            <Grid item xs={12}>
              {renderGeographicMap()}
            </Grid>
          </Grid>
        )}
        
        {selectedTab === 1 && (
          <Box>
            {renderGeographicMap()}
          </Box>
        )}
        
        {selectedTab === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {renderVolunteerTimeline()}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderConversionFunnel()}
            </Grid>
          </Grid>
        )}
        
        {selectedTab === 3 && (
          <Box>
            {renderBloodDriveTrends()}
          </Box>
        )}
        
        {selectedTab === 4 && (
          <Box>
            {renderDonorDistribution()}
          </Box>
        )}
        
        {selectedTab === 5 && (
          <Box>
            {renderAIInsights()}
          </Box>
        )}
      </Box>
    </Box>
  );

  if (loading && !kpis) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Box textAlign="center">
          <Typography variant="h5" gutterBottom>Loading Executive Dashboard...</Typography>
          <LinearProgress sx={{ width: 300, mt: 2 }} />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Alert severity="error">
          <Typography variant="h6">Failed to load dashboard</Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', p: 3 }}>
      {renderDashboard()}
    </Box>
  );
};

export default WorldClassExecutiveDashboard;