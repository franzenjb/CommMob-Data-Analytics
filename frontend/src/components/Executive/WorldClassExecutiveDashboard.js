import React, { useState, useEffect, useMemo } from 'react';
import { 
  ThemeProvider, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  IconButton,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  Button,
  Stack,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Dashboard,
  TrendingUp,
  TrendingDown,
  People,
  AttachMoney,
  BloodtypeOutlined,
  Analytics,
  Download,
  Share,
  Refresh,
  Settings,
  LightMode,
  DarkMode,
  Fullscreen,
  FilterList
} from '@mui/icons-material';
import { createExecutiveTheme } from '../../theme/executiveDesignSystem';
import '../../styles/executiveDashboard.css';

// Mock data for demonstration
const mockData = {
  kpis: {
    totalVolunteers: 127543,
    volunteerChange: 12.3,
    totalDonations: 45600000,
    donationChange: 18.7,
    bloodDrives: 1234,
    bloodDriveChange: 8.4,
    conversionRate: 23.8,
    conversionChange: -3.2
  },
  insights: [
    {
      id: 1,
      type: 'info',
      title: 'Volunteer Recruitment Opportunity',
      message: 'Southern regions show 15% higher conversion rates. Consider expanding recruitment efforts.',
      confidence: 0.89,
      priority: 'high'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Seasonal Blood Drive Trend',
      message: 'Historical data suggests 20% decrease in donations during holiday season. Plan accordingly.',
      confidence: 0.94,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'success',
      title: 'Digital Engagement Success',
      message: 'Mobile app engagement increased 45% following UX improvements.',
      confidence: 0.97,
      priority: 'low'
    }
  ]
};

const WorldClassExecutiveDashboard = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Create theme based on mode
  const theme = useMemo(() => createExecutiveTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Set theme attribute on document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const MetricCard = ({ title, value, change, icon: Icon, color, subtitle, loading = false }) => (
    <Card className="exec-metric-card" elevation={0}>
      <CardContent sx={{ p: 3 }}>
        {loading ? (
          <Box>
            <Box className="exec-skeleton" sx={{ width: '60%', height: 16, mb: 1 }} />
            <Box className="exec-skeleton" sx={{ width: '80%', height: 32, mb: 1 }} />
            <Box className="exec-skeleton" sx={{ width: '40%', height: 12 }} />
          </Box>
        ) : (
          <Box className="exec-metric-card-header">
            <Box>
              <Typography className="exec-metric-card-title" variant="caption">
                {title}
              </Typography>
              <Typography className="exec-metric-card-value" variant="h3" component="div">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </Typography>
              {subtitle && (
                <Typography className="exec-metric-card-subtitle" variant="caption">
                  {subtitle}
                </Typography>
              )}
              <Box className="exec-metric-card-footer">
                <Box className={`exec-metric-card-change ${change >= 0 ? 'positive' : 'negative'}`}>
                  {change >= 0 ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {Math.abs(change)}% {change >= 0 ? 'increase' : 'decrease'}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Avatar className="exec-metric-card-icon" sx={{ bgcolor: color, width: 56, height: 56 }}>
              <Icon />
            </Avatar>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const ExecutiveHeader = () => (
    <Box className="exec-dashboard-header">
      <Box className="exec-container">
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={6}>
            <Typography className="exec-headline-1" color="primary" gutterBottom>
              Red Cross Executive Command Center
            </Typography>
            <Typography className="exec-body-2" color="text.secondary">
              Real-time analytics and insights for strategic decision-making
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} justifyContent={{ xs: 'flex-start', md: 'flex-end' }} alignItems="center">
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                    icon={<LightMode />}
                    checkedIcon={<DarkMode />}
                  />
                }
                label=""
              />
              <Button className="exec-btn exec-btn-secondary" startIcon={<Download />}>
                Export
              </Button>
              <Button className="exec-btn exec-btn-secondary" startIcon={<Share />}>
                Share
              </Button>
              <Tooltip title="Refresh data">
                <IconButton onClick={() => setLoading(true)} color="primary">
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Tooltip title="Dashboard settings">
                <IconButton color="primary">
                  <Settings />
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  const KPISection = () => {
    if (!data) return null;

    const metrics = [
      {
        title: 'Total Volunteers',
        value: data.kpis.totalVolunteers,
        change: data.kpis.volunteerChange,
        icon: People,
        color: theme.palette.primary.main,
        subtitle: 'Active volunteers nationwide'
      },
      {
        title: 'Total Donations',
        value: `$${(data.kpis.totalDonations / 1000000).toFixed(1)}M`,
        change: data.kpis.donationChange,
        icon: AttachMoney,
        color: theme.palette.success.main,
        subtitle: 'Year-to-date contributions'
      },
      {
        title: 'Blood Drives',
        value: data.kpis.bloodDrives,
        change: data.kpis.bloodDriveChange,
        icon: BloodtypeOutlined,
        color: theme.palette.error.main,
        subtitle: 'Completed this quarter'
      },
      {
        title: 'Conversion Rate',
        value: `${data.kpis.conversionRate}%`,
        change: data.kpis.conversionChange,
        icon: Analytics,
        color: theme.palette.warning.main,
        subtitle: 'Applicant to volunteer'
      }
    ];

    return (
      <Grid container spacing={3}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard {...metric} loading={loading} />
          </Grid>
        ))}
      </Grid>
    );
  };

  const InsightsPanel = () => {
    if (!data || loading) return null;

    return (
      <Card className="exec-chart-container" elevation={0}>
        <CardContent sx={{ p: 3 }}>
          <Box className="exec-chart-header">
            <Typography className="exec-chart-title" variant="h6">
              AI-Powered Executive Insights
            </Typography>
            <Box className="exec-chart-controls">
              <Chip 
                label="Real-time" 
                color="primary" 
                size="small" 
                className="exec-chip exec-chip-primary"
              />
              <IconButton size="small">
                <FilterList />
              </IconButton>
            </Box>
          </Box>
          
          <Stack spacing={3} sx={{ mt: 2 }}>
            {data.insights.map((insight) => (
              <Alert 
                key={insight.id}
                severity={insight.type}
                className={`exec-alert exec-alert-${insight.type}`}
                sx={{
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    width: '100%'
                  }
                }}
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    {insight.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {insight.message}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={insight.confidence * 100}
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3
                          }
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {(insight.confidence * 100).toFixed(0)}% confidence
                    </Typography>
                    <Chip 
                      label={insight.priority} 
                      size="small"
                      color={insight.priority === 'high' ? 'error' : insight.priority === 'medium' ? 'warning' : 'default'}
                      className="exec-chip"
                    />
                  </Box>
                </Box>
              </Alert>
            ))}
          </Stack>
        </CardContent>
      </Card>
    );
  };

  const ChartPlaceholder = ({ title, height = 350 }) => (
    <Card className="exec-chart-container" elevation={0}>
      <CardContent sx={{ p: 3 }}>
        <Box className="exec-chart-header">
          <Typography className="exec-chart-title" variant="h6">
            {title}
          </Typography>
          <Box className="exec-chart-controls">
            <IconButton size="small">
              <Fullscreen />
            </IconButton>
          </Box>
        </Box>
        <Box 
          className="exec-chart-content"
          sx={{ 
            height, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            borderRadius: 2,
            border: `1px dashed ${theme.palette.divider}`
          }}
        >
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {loading ? (
              <Box>
                <Box className="exec-skeleton" sx={{ width: 200, height: 20, mx: 'auto', mb: 1 }} />
                <Box className="exec-skeleton" sx={{ width: 150, height: 16, mx: 'auto' }} />
              </Box>
            ) : (
              <Box>
                <Analytics sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                <br />
                Interactive {title} Chart
                <br />
                <Typography variant="caption" color="text.disabled">
                  Connect your data source to populate
                </Typography>
              </Box>
            )}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const TabContent = () => {
    const tabs = [
      { label: 'Overview', icon: Dashboard },
      { label: 'Analytics', icon: Analytics },
      { label: 'Volunteers', icon: People },
      { label: 'Donations', icon: AttachMoney },
      { label: 'Blood Services', icon: BloodtypeOutlined }
    ];

    return (
      <Box>
        <Tabs 
          value={selectedTab} 
          onChange={(e, v) => setSelectedTab(v)} 
          className="exec-tabs"
          sx={{ mb: 3 }}
        >
          {tabs.map((tab, index) => (
            <Tab 
              key={index}
              label={tab.label} 
              icon={<tab.icon />} 
              iconPosition="start"
              className="exec-tab"
            />
          ))}
        </Tabs>

        <Box>
          {selectedTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <InsightsPanel />
              </Grid>
              <Grid item xs={12} md={6}>
                <ChartPlaceholder title="Volunteer Growth Trends" />
              </Grid>
              <Grid item xs={12} md={6}>
                <ChartPlaceholder title="Geographic Distribution" />
              </Grid>
            </Grid>
          )}
          
          {selectedTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <ChartPlaceholder title="Advanced Analytics Dashboard" height={500} />
              </Grid>
              <Grid item xs={12} md={4}>
                <ChartPlaceholder title="Key Metrics" height={240} />
                <Box sx={{ mt: 3 }}>
                  <ChartPlaceholder title="Performance Indicators" height={240} />
                </Box>
              </Grid>
            </Grid>
          )}
          
          {selectedTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ChartPlaceholder title="Volunteer Applications" />
              </Grid>
              <Grid item xs={12} md={6}>
                <ChartPlaceholder title="Conversion Funnel" />
              </Grid>
            </Grid>
          )}
          
          {selectedTab === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ChartPlaceholder title="Donation Trends & Forecasting" height={450} />
              </Grid>
            </Grid>
          )}
          
          {selectedTab === 4 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <ChartPlaceholder title="Blood Drive Performance" height={400} />
              </Grid>
              <Grid item xs={12} md={4}>
                <ChartPlaceholder title="Collection Efficiency" height={400} />
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    );
  };

  if (loading && !data) {
    return (
      <ThemeProvider theme={theme}>
        <Box className="exec-dashboard">
          <ExecutiveHeader />
          <Box className="exec-dashboard-content">
            <Box className="exec-container">
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography className="exec-headline-2" gutterBottom>
                  Loading Executive Dashboard
                </Typography>
                <LinearProgress 
                  sx={{ 
                    width: 300, 
                    mx: 'auto', 
                    mt: 3,
                    height: 6,
                    borderRadius: 3
                  }} 
                />
                <Typography className="exec-body-2" sx={{ mt: 2 }} color="text.secondary">
                  Preparing your world-class analytics experience...
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box className="exec-dashboard">
        <ExecutiveHeader />
        
        <Box className="exec-dashboard-content">
          <Box className="exec-container">
            {/* KPI Section */}
            <Box sx={{ mb: 4 }}>
              <KPISection />
            </Box>

            {/* Tabbed Content */}
            <TabContent />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default WorldClassExecutiveDashboard;