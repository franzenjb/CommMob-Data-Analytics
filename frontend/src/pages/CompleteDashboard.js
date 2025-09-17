import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, IconButton, TextField,
  Select, MenuItem, FormControl, InputLabel, Button, Chip, Avatar,
  LinearProgress, Alert, Tabs, Tab, Paper, Divider, Stack,
  ToggleButton, ToggleButtonGroup, Tooltip, CircularProgress,
  List, ListItem, ListItemText, ListItemIcon, Badge, InputAdornment
} from '@mui/material';
import {
  Dashboard, Map, ShowChart, People, BloodtypeOutlined, AttachMoney,
  TrendingUp, Analytics, Search, FilterList, Download, Share, Refresh,
  Settings, AutoAwesome, LocationOn, Timeline, PieChart, BarChart,
  Speed, Warning, CheckCircle, Info, Notifications, CloudDownload,
  Assessment, Insights, FiberManualRecord, ArrowUpward, ArrowDownward
} from '@mui/icons-material';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import Plot from 'react-plotly.js';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import dataService from '../services/completeDataService';
import Papa from 'papaparse';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const CompleteDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [kpis, setKpis] = useState({});
  const [mapData, setMapData] = useState([]);
  const [trendData, setTrendData] = useState({});
  const [stateData, setStateData] = useState([]);
  const [donorData, setDonorData] = useState([]);
  const [bloodDriveData, setBloodDriveData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedMapLayers, setSelectedMapLayers] = useState(['all']);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    
    // Load all data
    await dataService.loadAllData();
    
    // Get processed data
    setKpis(dataService.getKPIs());
    setMapData(dataService.getMapData());
    setTrendData(dataService.getVolunteerTrendData());
    setStateData(dataService.getStateBreakdown());
    setDonorData(dataService.getDonorBreakdown());
    setBloodDriveData(dataService.getBloodDriveEfficiency());
    setPredictions(dataService.getPredictions());
    setAlerts(dataService.getAlerts());
    
    setLoading(false);
  };

  const handleAIQuery = () => {
    if (!aiQuery) return;
    
    // Simple AI responses based on keywords
    const responses = {
      volunteer: `Based on ${kpis.totalVolunteers?.toLocaleString()} volunteers, we have a ${kpis.conversionRate}% conversion rate. Focus on improving onboarding in high-growth regions.`,
      donor: `With ${kpis.totalDonors?.toLocaleString()} donors contributing $${(kpis.totalDonations/1000000).toFixed(1)}M, major donor concentration is a risk. Expand mid-level donor programs.`,
      blood: `Blood drive efficiency at ${kpis.efficiency}% across ${kpis.totalBloodDrives?.toLocaleString()} drives. Healthcare partnerships show highest collection rates.`,
      predict: `Expecting 12% volunteer growth and 18% donation increase over next 12 months based on current trends.`,
      default: `Analyzing ${kpis.totalApplicants?.toLocaleString()} applicants, ${kpis.totalVolunteers?.toLocaleString()} volunteers, and ${kpis.totalBloodDrives?.toLocaleString()} blood drives. All metrics trending positive.`
    };
    
    const query = aiQuery.toLowerCase();
    let response = responses.default;
    
    if (query.includes('volunteer')) response = responses.volunteer;
    else if (query.includes('donor')) response = responses.donor;
    else if (query.includes('blood')) response = responses.blood;
    else if (query.includes('predict') || query.includes('forecast')) response = responses.predict;
    
    setAiResponse(response);
  };

  const exportData = () => {
    // Export KPIs as CSV
    const csv = Papa.unparse([kpis]);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `redcross_dashboard_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const MetricCard = ({ title, value, change, icon: Icon, color, subtitle }) => (
    <Card elevation={3} sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="caption">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="textSecondary">
                {subtitle}
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
              <ArrowUpward color="success" fontSize="small" />
            ) : (
              <ArrowDownward color="error" fontSize="small" />
            )}
            <Typography
              variant="body2"
              color={change >= 0 ? 'success.main' : 'error.main'}
              ml={0.5}
            >
              {Math.abs(change)}% from last period
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderKPIs = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Total Volunteers"
          value={kpis.totalVolunteers}
          change={12}
          icon={People}
          color="primary.main"
          subtitle={`${kpis.activeVolunteers?.toLocaleString()} active`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Total Raised"
          value={`$${(kpis.totalDonations / 1000000).toFixed(1)}M`}
          change={18}
          icon={AttachMoney}
          color="success.main"
          subtitle={`${kpis.totalDonors?.toLocaleString()} donors`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Blood Drives"
          value={kpis.totalBloodDrives}
          change={8}
          icon={BloodtypeOutlined}
          color="error.main"
          subtitle={`${kpis.efficiency}% efficiency`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Conversion Rate"
          value={`${kpis.conversionRate}%`}
          change={-2}
          icon={TrendingUp}
          color="warning.main"
          subtitle="Applicant to volunteer"
        />
      </Grid>
    </Grid>
  );

  const renderMap = () => (
    <Card elevation={3} sx={{ height: 600 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            National Resource Distribution
          </Typography>
          <ToggleButtonGroup
            value={selectedMapLayers}
            onChange={(e, layers) => setSelectedMapLayers(layers || ['all'])}
            size="small"
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="volunteers">Volunteers</ToggleButton>
            <ToggleButton value="bloodDrives">Blood Drives</ToggleButton>
            <ToggleButton value="donors">Donors</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        
        <MapContainer
          center={[39.8283, -98.5795]}
          zoom={4}
          style={{ height: 500, width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          
          {mapData
            .filter(point => 
              selectedMapLayers.includes('all') || 
              selectedMapLayers.includes(point.type + 's')
            )
            .slice(0, 500) // Limit for performance
            .map((point, idx) => (
              <CircleMarker
                key={idx}
                center={[point.lat, point.lng]}
                radius={point.type === 'donor' ? 8 : 5}
                fillColor={
                  point.type === 'volunteer' ? '#2196f3' :
                  point.type === 'bloodDrive' ? '#f44336' : '#4caf50'
                }
                fillOpacity={0.7}
                stroke={false}
              >
                <Popup>
                  <strong>{point.title || point.type}</strong><br/>
                  {point.status && `Status: ${point.status}`}
                  {point.amount && `Amount: $${point.amount.toLocaleString()}`}
                  {point.collected && `Collected: ${point.collected}`}
                </Popup>
              </CircleMarker>
            ))}
        </MapContainer>
      </CardContent>
    </Card>
  );

  const renderVolunteerTrend = () => (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Volunteer Application Trends
        </Typography>
        <Plot
          data={[
            {
              x: trendData.labels,
              y: trendData.applications,
              type: 'scatter',
              mode: 'lines+markers',
              name: 'Applications',
              line: { color: '#2196f3', width: 3 },
              fill: 'tozeroy'
            },
            {
              x: trendData.labels,
              y: trendData.conversions,
              type: 'scatter',
              mode: 'lines+markers',
              name: 'Conversions',
              line: { color: '#4caf50', width: 3 }
            }
          ]}
          layout={{
            height: 400,
            hovermode: 'x unified',
            xaxis: { title: 'Month' },
            yaxis: { title: 'Count' },
            margin: { t: 20, r: 20, b: 60, l: 60 }
          }}
          config={{ responsive: true }}
        />
      </CardContent>
    </Card>
  );

  const renderStateBreakdown = () => (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Geographic Breakdown by State
        </Typography>
        <Plot
          data={[
            {
              x: stateData.map(s => s.state),
              y: stateData.map(s => s.volunteers),
              type: 'bar',
              name: 'Volunteers',
              marker: { color: '#2196f3' }
            },
            {
              x: stateData.map(s => s.state),
              y: stateData.map(s => s.bloodDrives),
              type: 'bar',
              name: 'Blood Drives',
              marker: { color: '#f44336' }
            }
          ]}
          layout={{
            height: 400,
            barmode: 'group',
            xaxis: { title: 'State' },
            yaxis: { title: 'Count' },
            margin: { t: 20, r: 20, b: 60, l: 60 }
          }}
          config={{ responsive: true }}
        />
      </CardContent>
    </Card>
  );

  const renderDonorDistribution = () => (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Donor Distribution by Gift Size
        </Typography>
        <Plot
          data={[{
            values: donorData.map(d => d.count),
            labels: donorData.map(d => d.range),
            type: 'pie',
            hole: 0.4,
            marker: {
              colors: ['#ffcdd2', '#ef9a9a', '#e57373', '#ef5350', '#f44336', '#e53935', '#d32f2f']
            }
          }]}
          layout={{
            height: 400,
            showlegend: true,
            margin: { t: 20, r: 20, b: 20, l: 20 }
          }}
          config={{ responsive: true }}
        />
      </CardContent>
    </Card>
  );

  const renderBloodDriveEfficiency = () => (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Blood Drive Performance by Year
        </Typography>
        <Plot
          data={[
            {
              x: bloodDriveData.map(d => d.year),
              y: bloodDriveData.map(d => d.drives),
              type: 'bar',
              name: 'Total Drives',
              marker: { color: '#d32f2f' },
              yaxis: 'y'
            },
            {
              x: bloodDriveData.map(d => d.year),
              y: bloodDriveData.map(d => parseFloat(d.efficiency)),
              type: 'scatter',
              mode: 'lines+markers',
              name: 'Efficiency %',
              line: { color: '#4caf50', width: 3 },
              marker: { size: 10 },
              yaxis: 'y2'
            }
          ]}
          layout={{
            height: 400,
            xaxis: { title: 'Year' },
            yaxis: { title: 'Number of Drives', side: 'left' },
            yaxis2: { 
              title: 'Efficiency %', 
              overlaying: 'y', 
              side: 'right',
              range: [80, 100]
            },
            margin: { t: 20, r: 60, b: 60, l: 60 }
          }}
          config={{ responsive: true }}
        />
      </CardContent>
    </Card>
  );

  const renderPredictions = () => (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Predictive Analytics
        </Typography>
        <List>
          {predictions.map((pred, idx) => (
            <ListItem key={idx}>
              <ListItemIcon>
                <Insights color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={pred.metric}
                secondary={
                  <Box>
                    <Typography variant="body2">
                      Current: {typeof pred.current === 'number' ? 
                        pred.current.toLocaleString() : pred.current}
                    </Typography>
                    <Typography variant="body2">
                      Predicted: {typeof pred.predicted === 'number' ? 
                        pred.predicted.toLocaleString() : pred.predicted} 
                      ({pred.timeframe})
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={pred.confidence} 
                      sx={{ mt: 1 }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      Confidence: {pred.confidence}%
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderAIInsights = () => (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          AI-Powered Insights
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask about your data (e.g., 'What regions need more volunteers?')"
          value={aiQuery}
          onChange={(e) => setAiQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAIQuery()}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleAIQuery}>
                  <AutoAwesome />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{ mb: 2 }}
        />
        
        {aiResponse && (
          <Alert severity="info">
            <Typography variant="body2">{aiResponse}</Typography>
          </Alert>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Executive Alerts
        </Typography>
        <Stack spacing={1}>
          {alerts.map((alert, idx) => (
            <Alert 
              key={idx} 
              severity={alert.severity === 'high' ? 'error' : 
                       alert.severity === 'medium' ? 'warning' : 'info'}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                {alert.title}
              </Typography>
              <Typography variant="body2">
                {alert.description}
              </Typography>
            </Alert>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', p: 3 }}>
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Red Cross Executive Analytics
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Comprehensive data insights from 320,000+ records
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" startIcon={<Download />} onClick={exportData}>
                Export Data
              </Button>
              <Button variant="outlined" startIcon={<Share />}>
                Share
              </Button>
              <IconButton onClick={loadAllData}>
                <Refresh />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box mb={3}>
        {renderKPIs()}
      </Box>

      <Tabs 
        value={selectedTab} 
        onChange={(e, v) => setSelectedTab(v)}
        sx={{ mb: 3 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Overview" icon={<Dashboard />} iconPosition="start" />
        <Tab label="Geographic" icon={<Map />} iconPosition="start" />
        <Tab label="Volunteers" icon={<People />} iconPosition="start" />
        <Tab label="Blood Services" icon={<BloodtypeOutlined />} iconPosition="start" />
        <Tab label="Financials" icon={<AttachMoney />} iconPosition="start" />
        <Tab label="Predictions" icon={<Insights />} iconPosition="start" />
        <Tab label="AI Analysis" icon={<AutoAwesome />} iconPosition="start" />
      </Tabs>

      {selectedTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {renderMap()}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderVolunteerTrend()}
          </Grid>
          <Grid item xs={12} md={6}>
            {renderStateBreakdown()}
          </Grid>
        </Grid>
      )}

      {selectedTab === 1 && renderMap()}
      
      {selectedTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {renderVolunteerTrend()}
          </Grid>
          <Grid item xs={12}>
            {renderStateBreakdown()}
          </Grid>
        </Grid>
      )}
      
      {selectedTab === 3 && renderBloodDriveEfficiency()}
      
      {selectedTab === 4 && renderDonorDistribution()}
      
      {selectedTab === 5 && renderPredictions()}
      
      {selectedTab === 6 && renderAIInsights()}
    </Box>
  );
};

export default CompleteDashboard;