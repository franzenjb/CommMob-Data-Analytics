import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
  AlertTitle,
  Chip,
  Button,
  TextField,
  IconButton,
  Divider
} from '@mui/material';
import {
  Warning,
  TrendingUp,
  TrendingDown,
  People,
  Security,
  AttachMoney,
  Speed,
  QuestionAnswer,
  Send,
  Map as MapIcon,
  Analytics
} from '@mui/icons-material';
import dataService from '../services/dataService';
import ExecutiveAIAgent from '../services/ExecutiveAIAgent';

const ExecutiveDashboard = () => {
  const [metrics, setMetrics] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExecutiveData();
  }, []);

  const loadExecutiveData = async () => {
    try {
      setLoading(true);
      const dashboardMetrics = await dataService.getDashboardMetrics();
      setMetrics(dashboardMetrics);
      
      // Generate executive alerts based on data
      const executiveAlerts = generateExecutiveAlerts(dashboardMetrics);
      setAlerts(executiveAlerts);
      
    } catch (error) {
      console.error('Error loading executive data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateExecutiveAlerts = (metrics) => {
    const alerts = [];
    
    // Volunteer threshold alert
    if (metrics.totalVolunteers < 50) {
      alerts.push({
        severity: 'error',
        title: 'Critical Volunteer Shortage',
        message: `Only ${metrics.totalVolunteers} active volunteers. Recommend immediate recruitment campaign.`,
        action: 'Launch Recruitment'
      });
    }
    
    // Conversion rate alert
    if (parseFloat(metrics.conversionRate) < 50) {
      alerts.push({
        severity: 'warning',
        title: 'Low Application Conversion',
        message: `${metrics.conversionRate}% conversion rate below target (60%). Review application process.`,
        action: 'Review Pipeline'
      });
    }
    
    // Geographic coverage alert
    if (metrics.geographicCoverage < 5) {
      alerts.push({
        severity: 'warning',
        title: 'Limited Geographic Coverage',
        message: `Coverage in only ${metrics.geographicCoverage} states. Consider expansion strategy.`,
        action: 'Plan Expansion'
      });
    }

    // Fundraising opportunity
    if (metrics.totalDonations > 50000) {
      alerts.push({
        severity: 'info',
        title: 'Strong Donor Performance',
        message: `$${metrics.totalDonations.toLocaleString()} raised. Opportunity for major gift campaign.`,
        action: 'Plan Campaign'
      });
    }

    return alerts;
  };

  const handleAIQuery = async () => {
    if (!aiQuery.trim()) return;
    
    try {
      const response = await ExecutiveAIAgent.processExecutiveQuery(aiQuery, metrics);
      setAiResponse(response.recommendation);
      setAiQuery('');
    } catch (error) {
      console.error('AI query error:', error);
      setAiResponse('AI analysis temporarily unavailable. Please try again.');
    }
  };

  const KPICard = ({ title, value, change, icon, color = 'primary' }) => (
    <Card sx={{ height: '100%', border: `2px solid`, borderColor: `${color}.main` }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" component="div" color={color + '.main'}>
              {value}
            </Typography>
            {change && (
              <Box display="flex" alignItems="center" mt={1}>
                {parseFloat(change) > 0 ? (
                  <TrendingUp color="success" fontSize="small" />
                ) : (
                  <TrendingDown color="error" fontSize="small" />
                )}
                <Typography 
                  variant="body2" 
                  color={parseFloat(change) > 0 ? 'success.main' : 'error.main'}
                  ml={0.5}
                >
                  {change}%
                </Typography>
              </Box>
            )}
          </Box>
          <Box color={color + '.main'}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant="h6">Loading Executive Dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          🏛️ Red Cross Executive Command Center
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Strategic insights and decision support for American Red Cross leadership
        </Typography>
      </Box>

      {/* Critical Alerts */}
      {alerts.length > 0 && (
        <Box mb={4}>
          <Typography variant="h5" gutterBottom color="error">
            🚨 Critical Alerts Requiring Attention
          </Typography>
          <Grid container spacing={2}>
            {alerts.map((alert, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Alert 
                  severity={alert.severity} 
                  sx={{ height: '100%' }}
                  action={
                    <Button color="inherit" size="small">
                      {alert.action}
                    </Button>
                  }
                >
                  <AlertTitle>{alert.title}</AlertTitle>
                  {alert.message}
                </Alert>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Key Performance Indicators */}
      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          📈 Key Performance Indicators
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Active Volunteers"
              value={metrics.totalVolunteers?.toLocaleString() || '0'}
              change="2.3"
              icon={<People fontSize="large" />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Readiness Score"
              value={`${Math.round((metrics.conversionRate || 0) * 1.2)}%`}
              change="-5"
              icon={<Security fontSize="large" />}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Total Fundraising"
              value={`$${((metrics.totalDonations || 0) / 1000).toFixed(1)}K`}
              change="8.7"
              icon={<AttachMoney fontSize="large" />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Operational Efficiency"
              value={`${Math.round(metrics.conversionRate || 0)}%`}
              change="1.2"
              icon={<Speed fontSize="large" />}
              color="info"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Geographic Overview and AI Assistant */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '400px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🗺️ Geographic Risk Assessment
              </Typography>
              <Box 
                display="flex" 
                alignItems="center" 
                justifyContent="center" 
                height="300px"
                bgcolor="grey.100"
                borderRadius={1}
              >
                <Box textAlign="center">
                  <MapIcon sx={{ fontSize: 60, color: 'grey.500', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary">
                    Interactive Risk Map
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Volunteer density vs. disaster risk zones
                  </Typography>
                  <Button 
                    variant="outlined" 
                    startIcon={<Analytics />}
                    sx={{ mt: 2 }}
                  >
                    View Full Map Analysis
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '400px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                <QuestionAnswer sx={{ mr: 1 }} />
                Executive AI Assistant
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {/* AI Query Input */}
              <Box mb={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Ask me anything about your operations..."
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAIQuery()}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleAIQuery} color="primary">
                        <Send />
                      </IconButton>
                    )
                  }}
                />
              </Box>

              {/* Quick Questions */}
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Quick Questions:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {[
                    'Show resource gaps',
                    'Recruitment priorities',
                    'Donor risks',
                    'Expansion opportunities'
                  ].map((question) => (
                    <Chip
                      key={question}
                      label={question}
                      size="small"
                      onClick={() => setAiQuery(question)}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>

              {/* AI Response */}
              {aiResponse && (
                <Box 
                  sx={{ 
                    bgcolor: 'primary.light', 
                    color: 'primary.contrastText',
                    p: 2, 
                    borderRadius: 1,
                    maxHeight: '150px',
                    overflowY: 'auto'
                  }}
                >
                  <Typography variant="body2">
                    {aiResponse}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          ⚡ Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button variant="contained" color="primary" size="large">
              Launch Recruitment Campaign
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="secondary" size="large">
              Generate Board Report
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="info" size="large">
              Schedule Strategy Meeting
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="warning" size="large">
              Review Resource Allocation
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ExecutiveDashboard;
