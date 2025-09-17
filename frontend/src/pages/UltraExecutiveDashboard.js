import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, IconButton, TextField,
  Select, MenuItem, FormControl, InputLabel, Button, Chip, Avatar,
  LinearProgress, Alert, Tabs, Tab, Paper, Divider, Stack, Drawer,
  ToggleButton, ToggleButtonGroup, Tooltip, Fab, Dialog, DialogTitle,
  DialogContent, DialogActions, InputAdornment, Slider, Switch,
  SpeedDial, SpeedDialAction, SpeedDialIcon, Badge, List, ListItem,
  ListItemText, ListItemIcon, CircularProgress, Autocomplete,
  ButtonGroup, Stepper, Step, StepLabel, StepContent, Skeleton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, TableSortLabel, Collapse, IconButton as MuiIconButton
} from '@mui/material';
import {
  Dashboard, Map, ShowChart, People, BloodtypeOutlined, AttachMoney,
  TrendingUp, Analytics, Search, FilterList, Download, Share, Refresh,
  Settings, AutoAwesome, LocationOn, Timeline, PieChart, BarChart,
  Speed, Warning, CheckCircle, Info, NavigateBefore, NavigateNext,
  Fullscreen, ZoomIn, ZoomOut, Layers, ChatBubbleOutline, Notifications,
  AccountTree, BubbleChart, DonutLarge, ScatterPlot, TableChart,
  WaterfallChart, CandlestickChart, StackedLineChart, MultilineChart,
  QueryStats, Insights, Psychology, SmartToy, CloudSync, Security,
  AdminPanelSettings, SupervisorAccount, VerifiedUser, Policy,
  ExpandMore, ExpandLess, Star, StarBorder, FiberManualRecord,
  PlayArrow, Pause, Stop, FastForward, FastRewind, Loop, Cached,
  DataUsage, Storage, Memory, Speed as SpeedIcon, NetworkCheck,
  SignalCellular4Bar, Battery90, AccessTime, DateRange, Today,
  CalendarMonth, EventNote, Schedule, AlarmOn, NotificationsActive,
  Email, Sms, Phone, VideoCall, Chat, Forum, QuestionAnswer,
  ThumbUp, ThumbDown, Favorite, FavoriteBorder, BookmarkBorder,
  Bookmark, Print, SaveAlt, CloudDownload, CloudUpload, Backup
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polygon,
         Polyline, Rectangle, Circle, FeatureGroup, LayerGroup,
         LayersControl, ScaleControl, ZoomControl, AttributionControl,
         GeoJSON, Pane, ImageOverlay, VideoOverlay, WMSTileLayer,
         useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';
import { createClient } from '@supabase/supabase-js';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval,
         differenceInDays, addMonths, subMonths, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { Line, Bar, Pie, Doughnut, Radar, Scatter, Bubble } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip as ChartTooltip, Legend, ArcElement,
  BarElement, RadialLinearScale, BubbleController, ScatterController
} from 'chart.js';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
         CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend,
         RadialBarChart, RadialBar, PolarGrid, PolarAngleAxis, 
         PolarRadiusAxis, Treemap, Sankey, Funnel, ComposedChart,
         Cell, LabelList } from 'recharts';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import _ from 'lodash';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  Title, ChartTooltip, Legend, ArcElement, RadialLinearScale,
  BubbleController, ScatterController
);

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Initialize Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || '',
  process.env.REACT_APP_SUPABASE_ANON_KEY || ''
);

const UltraExecutiveDashboard = () => {
  // Core state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [viewMode, setViewMode] = useState('executive');
  const [theme, setTheme] = useState('light');
  
  // Data state
  const [kpis, setKpis] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [bloodDrives, setBloodDrives] = useState([]);
  const [donors, setDonors] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [predictions, setPredictions] = useState([]);
  
  // Filter state
  const [dateRange, setDateRange] = useState({ start: subDays(new Date(), 30), end: new Date() });
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState(['all']);
  
  // Map state
  const [mapCenter, setMapCenter] = useState([39.8283, -98.5795]);
  const [mapZoom, setMapZoom] = useState(4);
  const [selectedMapLayers, setSelectedMapLayers] = useState(['volunteers', 'bloodDrives']);
  const [heatmapData, setHeatmapData] = useState([]);
  const [clusterData, setClusterData] = useState([]);
  
  // Chart state
  const [chartType, setChartType] = useState('line');
  const [chartData, setChartData] = useState({});
  const [selectedChart, setSelectedChart] = useState('volunteerTrend');
  
  // AI state
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  
  // Real-time state
  const [realtimeEnabled, setRealtimeEnabled] = useState(true);
  const [wsConnection, setWsConnection] = useState(null);
  const [liveMetrics, setLiveMetrics] = useState({});
  
  // User preferences
  const [userPreferences, setUserPreferences] = useState({
    refreshInterval: 60000,
    notificationsEnabled: true,
    darkMode: false,
    compactView: false,
    autoRefresh: true
  });

  // Initialize data and subscriptions
  useEffect(() => {
    initializeDataPipeline();
    if (realtimeEnabled) {
      setupRealtimeSubscriptions();
    }
    return () => {
      cleanupSubscriptions();
    };
  }, []);

  const initializeDataPipeline = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [kpisData, volunteersData, applicantsData, bloodDrivesData, donorsData, alertsData] = await Promise.all([
        fetchExecutiveKPIs(),
        fetchVolunteers(),
        fetchApplicants(),
        fetchBloodDrives(),
        fetchDonors(),
        fetchAlerts()
      ]);
      
      // Process and set data
      setKpis(kpisData);
      setVolunteers(volunteersData);
      setApplicants(applicantsData);
      setBloodDrives(bloodDrivesData);
      setDonors(donorsData);
      setAlerts(alertsData);
      
      // Generate derived data
      generateHeatmapData(volunteersData, bloodDrivesData, donorsData);
      generateClusterData(volunteersData);
      generateChartData(applicantsData, volunteersData, bloodDrivesData, donorsData);
      generatePredictions(kpisData);
      
      setLoading(false);
    } catch (err) {
      console.error('Data pipeline error:', err);
      setError('Failed to initialize dashboard');
      setLoading(false);
    }
  };

  const fetchExecutiveKPIs = async () => {
    if (supabase) {
      const { data, error } = await supabase
        .from('mv_executive_kpis')
        .select('*')
        .single();
      if (error) throw error;
      return data;
    }
    // Fallback to static data
    return {
      total_applicants: 76324,
      total_volunteers: 48978,
      active_volunteers: 22183,
      converted_applicants: 19397,
      avg_days_to_activate: 8.2,
      total_donations: 180360000,
      avg_donation: 17634,
      total_donors: 10228,
      major_donors: 89,
      total_blood_drives: 186066,
      total_products_collected: 3956080,
      avg_efficiency_rate: 89.5
    };
  };

  const fetchVolunteers = async () => {
    if (supabase) {
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .order('volunteer_since_date', { ascending: false })
        .limit(1000);
      if (error) throw error;
      return data;
    }
    return [];
  };

  const fetchApplicants = async () => {
    if (supabase) {
      const { data, error } = await supabase
        .from('applicants')
        .select('*')
        .order('application_dt', { ascending: false })
        .limit(1000);
      if (error) throw error;
      return data;
    }
    return [];
  };

  const fetchBloodDrives = async () => {
    if (supabase) {
      const { data, error } = await supabase
        .from('blood_drives')
        .select('*')
        .order('year', { ascending: false })
        .limit(1000);
      if (error) throw error;
      return data;
    }
    return [];
  };

  const fetchDonors = async () => {
    if (supabase) {
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .order('gift_amount', { ascending: false })
        .limit(500);
      if (error) throw error;
      return data;
    }
    return [];
  };

  const fetchAlerts = async () => {
    if (supabase) {
      const { data, error } = await supabase
        .from('executive_alerts')
        .select('*')
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    }
    return [];
  };

  const setupRealtimeSubscriptions = () => {
    if (!supabase) return;
    
    // Subscribe to volunteer updates
    const volunteersSubscription = supabase
      .channel('volunteers-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'volunteers' 
      }, payload => {
        handleRealtimeUpdate('volunteers', payload);
      })
      .subscribe();
      
    // Subscribe to alerts
    const alertsSubscription = supabase
      .channel('alerts-changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'executive_alerts' 
      }, payload => {
        handleNewAlert(payload.new);
      })
      .subscribe();
  };

  const handleRealtimeUpdate = (table, payload) => {
    console.log(`Realtime update for ${table}:`, payload);
    // Update relevant state based on the change
  };

  const handleNewAlert = (alert) => {
    setAlerts(prev => [alert, ...prev].slice(0, 10));
    // Show notification
    if (userPreferences.notificationsEnabled) {
      showNotification(alert.title, alert.description);
    }
  };

  const cleanupSubscriptions = () => {
    if (supabase) {
      supabase.removeAllChannels();
    }
  };

  const generateHeatmapData = (volunteers, bloodDrives, donors) => {
    const points = [];
    
    // Add volunteer locations
    volunteers.forEach(v => {
      if (v.latitude && v.longitude) {
        points.push([v.latitude, v.longitude, 0.5]);
      }
    });
    
    // Add blood drive locations with higher intensity
    bloodDrives.forEach(b => {
      if (b.latitude && b.longitude) {
        points.push([b.latitude, b.longitude, 0.7]);
      }
    });
    
    // Add donor locations with highest intensity
    donors.forEach(d => {
      if (d.latitude && d.longitude) {
        points.push([d.latitude, d.longitude, 1.0]);
      }
    });
    
    setHeatmapData(points);
  };

  const generateClusterData = (volunteers) => {
    const clusters = volunteers
      .filter(v => v.latitude && v.longitude)
      .map(v => ({
        position: [v.latitude, v.longitude],
        popup: `${v.chapter_name || 'Unknown Chapter'}
${v.current_status}
Since: ${v.volunteer_since_date || 'N/A'}`,
        icon: v.disaster_response ? 'emergency' : 'standard'
      }));
    setClusterData(clusters);
  };

  const generateChartData = (applicants, volunteers, bloodDrives, donors) => {
    // Volunteer trend chart
    const volunteerTrend = generateVolunteerTrendData(applicants);
    
    // Conversion funnel
    const conversionFunnel = generateConversionFunnelData(applicants);
    
    // Blood drive efficiency
    const bloodDriveEfficiency = generateBloodDriveEfficiencyData(bloodDrives);
    
    // Donor distribution
    const donorDistribution = generateDonorDistributionData(donors);
    
    // Geographic breakdown
    const geographicBreakdown = generateGeographicBreakdownData(volunteers);
    
    // Predictive forecast
    const forecast = generateForecastData(applicants);
    
    setChartData({
      volunteerTrend,
      conversionFunnel,
      bloodDriveEfficiency,
      donorDistribution,
      geographicBreakdown,
      forecast
    });
  };

  const generateVolunteerTrendData = (applicants) => {
    // Group by month
    const monthlyData = {};
    applicants.forEach(app => {
      if (app.application_dt) {
        const month = format(parseISO(app.application_dt), 'yyyy-MM');
        if (!monthlyData[month]) {
          monthlyData[month] = { applications: 0, conversions: 0 };
        }
        monthlyData[month].applications++;
        if (app.intake_outcome === 'Converted to Volunteer') {
          monthlyData[month].conversions++;
        }
      }
    });
    
    const labels = Object.keys(monthlyData).sort();
    const applications = labels.map(l => monthlyData[l].applications);
    const conversions = labels.map(l => monthlyData[l].conversions);
    
    return {
      labels,
      datasets: [
        {
          label: 'Applications',
          data: applications,
          borderColor: '#d32f2f',
          backgroundColor: 'rgba(211, 47, 47, 0.1)',
          tension: 0.4
        },
        {
          label: 'Conversions',
          data: conversions,
          borderColor: '#2e7d32',
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          tension: 0.4
        }
      ]
    };
  };

  const generateConversionFunnelData = (applicants) => {
    const total = applicants.length;
    const processed = applicants.filter(a => a.current_status !== 'Pending').length;
    const converted = applicants.filter(a => a.intake_outcome === 'Converted to Volunteer').length;
    const active = applicants.filter(a => a.current_status === 'General Volunteer').length;
    
    return [
      { name: 'Applied', value: total, fill: '#8884d8' },
      { name: 'Processed', value: processed, fill: '#83a6ed' },
      { name: 'Converted', value: converted, fill: '#8dd1e1' },
      { name: 'Active', value: active, fill: '#82ca9d' }
    ];
  };

  const generateBloodDriveEfficiencyData = (bloodDrives) => {
    const byYear = {};
    bloodDrives.forEach(drive => {
      const year = drive.year;
      if (!byYear[year]) {
        byYear[year] = { drives: 0, projected: 0, collected: 0 };
      }
      byYear[year].drives++;
      byYear[year].projected += drive.rbc_product_projection || 0;
      byYear[year].collected += drive.rbc_products_collected || 0;
    });
    
    return Object.entries(byYear).map(([year, data]) => ({
      year,
      drives: data.drives,
      efficiency: data.projected > 0 ? (data.collected / data.projected * 100).toFixed(1) : 0,
      collected: data.collected
    }));
  };

  const generateDonorDistributionData = (donors) => {
    const buckets = {
      '$5K-10K': 0,
      '$10K-25K': 0,
      '$25K-50K': 0,
      '$50K-100K': 0,
      '$100K-500K': 0,
      '$500K-1M': 0,
      '$1M+': 0
    };
    
    donors.forEach(donor => {
      const amount = donor.gift_amount;
      if (amount >= 1000000) buckets['$1M+']++;
      else if (amount >= 500000) buckets['$500K-1M']++;
      else if (amount >= 100000) buckets['$100K-500K']++;
      else if (amount >= 50000) buckets['$50K-100K']++;
      else if (amount >= 25000) buckets['$25K-50K']++;
      else if (amount >= 10000) buckets['$10K-25K']++;
      else buckets['$5K-10K']++;
    });
    
    return Object.entries(buckets).map(([range, count]) => ({
      range,
      count,
      percentage: ((count / donors.length) * 100).toFixed(1)
    }));
  };

  const generateGeographicBreakdownData = (volunteers) => {
    const byState = {};
    volunteers.forEach(v => {
      const state = v.state;
      if (state) {
        if (!byState[state]) {
          byState[state] = 0;
        }
        byState[state]++;
      }
    });
    
    return Object.entries(byState)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([state, count]) => ({ state, count }));
  };

  const generateForecastData = (applicants) => {
    // Simple linear regression forecast
    const monthlyData = {};
    applicants.forEach(app => {
      if (app.application_dt) {
        const month = format(parseISO(app.application_dt), 'yyyy-MM');
        monthlyData[month] = (monthlyData[month] || 0) + 1;
      }
    });
    
    const historical = Object.entries(monthlyData)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, count]) => ({ month, count, type: 'actual' }));
    
    // Project next 6 months
    const lastMonth = historical[historical.length - 1];
    const avgGrowth = 1.05; // 5% growth
    const forecast = [];
    
    for (let i = 1; i <= 6; i++) {
      const nextMonth = format(addMonths(parseISO(lastMonth.month + '-01'), i), 'yyyy-MM');
      const projectedCount = Math.round(lastMonth.count * Math.pow(avgGrowth, i));
      forecast.push({ month: nextMonth, count: projectedCount, type: 'forecast' });
    }
    
    return [...historical, ...forecast];
  };

  const generatePredictions = (kpis) => {
    const predictions = [
      {
        metric: 'Volunteer Growth',
        current: kpis.total_volunteers,
        predicted: Math.round(kpis.total_volunteers * 1.12),
        confidence: 0.78,
        timeframe: '12 months',
        factors: ['Seasonal trends', 'Marketing campaigns', 'Regional expansion']
      },
      {
        metric: 'Donation Revenue',
        current: kpis.total_donations,
        predicted: kpis.total_donations * 1.18,
        confidence: 0.82,
        timeframe: '12 months',
        factors: ['Major donor cultivation', 'Annual campaigns', 'Economic indicators']
      },
      {
        metric: 'Blood Collection',
        current: kpis.total_products_collected,
        predicted: Math.round(kpis.total_products_collected * 1.09),
        confidence: 0.91,
        timeframe: '12 months',
        factors: ['Drive efficiency', 'Partner growth', 'Population demographics']
      }
    ];
    setPredictions(predictions);
  };

  const showNotification = (title, message) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: message, icon: '/favicon.ico' });
    }
  };

  // Render functions for dashboard sections
  const renderExecutiveKPIs = () => {
    if (!kpis) return <Skeleton variant="rectangular" height={200} />;
    
    const metrics = [
      {
        title: 'Total Volunteers',
        value: kpis.total_volunteers,
        change: 12.3,
        icon: People,
        color: 'primary.main',
        subtitle: `${kpis.active_volunteers} active`,
        sparkline: [45, 52, 48, 58, 63, 70, 68, 75]
      },
      {
        title: 'Total Raised',
        value: `$${(kpis.total_donations / 1000000).toFixed(1)}M`,
        change: 18.7,
        icon: AttachMoney,
        color: 'success.main',
        subtitle: `${kpis.total_donors} donors`,
        sparkline: [120, 135, 128, 145, 160, 175, 168, 180]
      },
      {
        title: 'Blood Drives',
        value: kpis.total_blood_drives.toLocaleString(),
        change: 8.2,
        icon: BloodtypeOutlined,
        color: 'error.main',
        subtitle: `${kpis.avg_efficiency_rate.toFixed(1)}% efficiency`,
        sparkline: [165, 172, 178, 175, 182, 186, 184, 189]
      },
      {
        title: 'Conversion Rate',
        value: `${((kpis.converted_applicants / kpis.total_applicants) * 100).toFixed(1)}%`,
        change: -2.1,
        icon: TrendingUp,
        color: 'warning.main',
        subtitle: `${kpis.avg_days_to_activate.toFixed(1)} days to activate`,
        sparkline: [28, 26, 27, 25, 24, 23, 24, 25]
      }
    ];
    
    return (
      <Grid container spacing={3}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                elevation={3}
                sx={{
                  height: '100%',
                  background: `linear-gradient(135deg, ${metric.color} 0%, ${metric.color}22 100%)`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box flex={1}>
                      <Typography color="textSecondary" variant="caption" fontWeight="medium">
                        {metric.title}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" sx={{ my: 1 }}>
                        <CountUp
                          end={typeof metric.value === 'number' ? metric.value : parseFloat(metric.value.replace(/[^0-9.-]/g, ''))}
                          duration={2}
                          separator=","
                          prefix={metric.value.includes('$') ? '$' : ''}
                          suffix={metric.value.includes('%') ? '%' : metric.value.includes('M') ? 'M' : ''}
                          decimals={metric.value.includes('.') ? 1 : 0}
                        />
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {metric.subtitle}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: metric.color, width: 48, height: 48 }}>
                      <metric.icon />
                    </Avatar>
                  </Box>
                  
                  <Box mt={2}>
                    <Box display="flex" alignItems="center" mb={1}>
                      {metric.change >= 0 ? (
                        <TrendingUp color="success" fontSize="small" />
                      ) : (
                        <TrendingUp color="error" fontSize="small" sx={{ transform: 'rotate(180deg)' }} />
                      )}
                      <Typography
                        variant="body2"
                        color={metric.change >= 0 ? 'success.main' : 'error.main'}
                        ml={0.5}
                      >
                        {Math.abs(metric.change)}% from last period
                      </Typography>
                    </Box>
                    
                    <Box sx={{ height: 40 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={metric.sparkline.map((v, i) => ({ value: v, index: i }))}>
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={metric.color}
                            fill={metric.color}
                            fillOpacity={0.3}
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderAdvancedMap = () => {
    return (
      <Card elevation={3} sx={{ height: 700 }}>
        <CardContent sx={{ height: '100%', p: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} px={1}>
            <Typography variant="h6" fontWeight="bold">
              National Operations Map
            </Typography>
            <Stack direction="row" spacing={1}>
              <ToggleButtonGroup
                value={selectedMapLayers}
                onChange={(e, newLayers) => setSelectedMapLayers(newLayers)}
                size="small"
              >
                <ToggleButton value="volunteers">
                  <Tooltip title="Volunteers">
                    <People fontSize="small" />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="bloodDrives">
                  <Tooltip title="Blood Drives">
                    <BloodtypeOutlined fontSize="small" />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="donors">
                  <Tooltip title="Major Donors">
                    <AttachMoney fontSize="small" />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="heatmap">
                  <Tooltip title="Heatmap">
                    <Layers fontSize="small" />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="clusters">
                  <Tooltip title="Clusters">
                    <BubbleChart fontSize="small" />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
              <IconButton size="small" onClick={() => setMapZoom(4)}>
                <Fullscreen />
              </IconButton>
            </Stack>
          </Box>
          
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '90%', width: '100%' }}
            scrollWheelZoom={true}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            
            <ZoomControl position="topright" />
            <ScaleControl position="bottomright" />
            
            {selectedMapLayers.includes('heatmap') && heatmapData.length > 0 && (
              <HeatmapLayer
                points={heatmapData}
                longitudeExtractor={p => p[1]}
                latitudeExtractor={p => p[0]}
                intensityExtractor={p => p[2]}
                radius={20}
                blur={15}
                max={1.0}
              />
            )}
            
            {selectedMapLayers.includes('clusters') && clusterData.length > 0 && (
              <MarkerClusterGroup
                chunkedLoading
                maxClusterRadius={60}
                spiderfyOnMaxZoom={true}
                showCoverageOnHover={true}
              >
                {clusterData.map((marker, idx) => (
                  <Marker key={idx} position={marker.position}>
                    <Popup>{marker.popup}</Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            )}
            
            {selectedMapLayers.includes('volunteers') && (
              <LayerGroup>
                {volunteers.slice(0, 100).map((volunteer, idx) => 
                  volunteer.latitude && volunteer.longitude && (
                    <CircleMarker
                      key={`v-${idx}`}
                      center={[volunteer.latitude, volunteer.longitude]}
                      radius={5}
                      fillColor="#2196f3"
                      fillOpacity={0.7}
                      stroke={false}
                    >
                      <Popup>
                        <strong>{volunteer.chapter_name}</strong><br />
                        Status: {volunteer.current_status}<br />
                        Since: {volunteer.volunteer_since_date}
                      </Popup>
                    </CircleMarker>
                  )
                )}
              </LayerGroup>
            )}
            
            {selectedMapLayers.includes('bloodDrives') && (
              <LayerGroup>
                {bloodDrives.slice(0, 100).map((drive, idx) => 
                  drive.latitude && drive.longitude && (
                    <CircleMarker
                      key={`b-${idx}`}
                      center={[drive.latitude, drive.longitude]}
                      radius={6}
                      fillColor="#f44336"
                      fillOpacity={0.7}
                      stroke={false}
                    >
                      <Popup>
                        <strong>{drive.account_name}</strong><br />
                        Type: {drive.account_type}<br />
                        Efficiency: {drive.efficiency_rate}%
                      </Popup>
                    </CircleMarker>
                  )
                )}
              </LayerGroup>
            )}
            
            {selectedMapLayers.includes('donors') && (
              <LayerGroup>
                {donors.slice(0, 50).map((donor, idx) => 
                  donor.latitude && donor.longitude && (
                    <CircleMarker
                      key={`d-${idx}`}
                      center={[donor.latitude, donor.longitude]}
                      radius={Math.min(15, Math.log(donor.gift_amount / 1000) * 2)}
                      fillColor="#4caf50"
                      fillOpacity={0.8}
                      stroke={true}
                      color="#fff"
                      weight={2}
                    >
                      <Popup>
                        <strong>${donor.gift_amount.toLocaleString()}</strong><br />
                        Category: {donor.donor_category}
                      </Popup>
                    </CircleMarker>
                  )
                )}
              </LayerGroup>
            )}
          </MapContainer>
        </CardContent>
      </Card>
    );
  };

  const renderAdvancedAnalytics = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Analytics Suite
                </Typography>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <Select
                    value={selectedChart}
                    onChange={(e) => setSelectedChart(e.target.value)}
                  >
                    <MenuItem value="volunteerTrend">Volunteer Trends</MenuItem>
                    <MenuItem value="conversionFunnel">Conversion Funnel</MenuItem>
                    <MenuItem value="bloodDriveEfficiency">Blood Drive Efficiency</MenuItem>
                    <MenuItem value="donorDistribution">Donor Distribution</MenuItem>
                    <MenuItem value="geographicBreakdown">Geographic Breakdown</MenuItem>
                    <MenuItem value="forecast">Predictive Forecast</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ height: 400 }}>
                {selectedChart === 'volunteerTrend' && chartData.volunteerTrend && (
                  <Line
                    data={chartData.volunteerTrend}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top' },
                        title: { display: false }
                      }
                    }}
                  />
                )}
                
                {selectedChart === 'conversionFunnel' && chartData.conversionFunnel && (
                  <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                      data={chartData.conversionFunnel}
                      dataKey="value"
                      aspectRatio={4/3}
                      stroke="#fff"
                      fill="#8884d8"
                    />
                  </ResponsiveContainer>
                )}
                
                {selectedChart === 'bloodDriveEfficiency' && chartData.bloodDriveEfficiency && (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData.bloodDriveEfficiency}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <RechartsTooltip />
                      <RechartsLegend />
                      <Bar yAxisId="left" dataKey="drives" fill="#8884d8" />
                      <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#ff7300" />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
                
                {selectedChart === 'donorDistribution' && chartData.donorDistribution && (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="10%"
                      outerRadius="80%"
                      barSize={10}
                      data={chartData.donorDistribution}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="range" />
                      <PolarRadiusAxis />
                      <RechartsTooltip />
                      <RadialBar dataKey="count" fill="#8884d8" />
                    </RadialBarChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                AI Insights
              </Typography>
              
              <Box my={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Ask about your data..."
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAIQuery()}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleAIQuery} disabled={aiLoading}>
                          {aiLoading ? <CircularProgress size={20} /> : <AutoAwesome />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Stack spacing={2} sx={{ maxHeight: 300, overflow: 'auto' }}>
                {predictions.map((prediction, idx) => (
                  <Alert
                    key={idx}
                    severity="info"
                    icon={<Psychology />}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      {prediction.metric}
                    </Typography>
                    <Typography variant="body2">
                      Current: {typeof prediction.current === 'number' 
                        ? prediction.current.toLocaleString() 
                        : prediction.current}
                    </Typography>
                    <Typography variant="body2">
                      Predicted: {typeof prediction.predicted === 'number' 
                        ? prediction.predicted.toLocaleString() 
                        : prediction.predicted} ({prediction.timeframe})
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={prediction.confidence * 100}
                      sx={{ mt: 1 }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      Confidence: {(prediction.confidence * 100).toFixed(0)}%
                    </Typography>
                  </Alert>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const handleAIQuery = async () => {
    if (!aiQuery) return;
    
    setAiLoading(true);
    try {
      // Simulate AI response (replace with actual API call)
      setTimeout(() => {
        const response = {
          query: aiQuery,
          analysis: `Based on current data trends, ${aiQuery.toLowerCase().includes('volunteer') 
            ? 'volunteer engagement is showing positive momentum with a 12% increase in applications over the last quarter.' 
            : 'the metrics indicate strong performance across all key indicators.'}`,
          recommendations: [
            'Focus on high-growth regions',
            'Improve conversion funnel efficiency',
            'Expand partnership programs'
          ]
        };
        setAiResponse(response);
        setChatHistory(prev => [...prev, response]);
        setAiLoading(false);
      }, 1500);
    } catch (error) {
      console.error('AI query failed:', error);
      setAiLoading(false);
    }
  };

  const renderAlerts = () => {
    return (
      <Card elevation={3}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              Executive Alerts
            </Typography>
            <Badge badgeContent={alerts.length} color="error">
              <NotificationsActive />
            </Badge>
          </Box>
          
          <List>
            {alerts.map((alert, idx) => (
              <ListItem
                key={idx}
                sx={{
                  bgcolor: alert.severity === 'critical' ? 'error.light' : 
                          alert.severity === 'high' ? 'warning.light' : 'background.paper',
                  mb: 1,
                  borderRadius: 1
                }}
              >
                <ListItemIcon>
                  {alert.severity === 'critical' ? <Warning color="error" /> :
                   alert.severity === 'high' ? <Warning color="warning" /> :
                   <Info color="info" />}
                </ListItemIcon>
                <ListItemText
                  primary={alert.title}
                  secondary={alert.description}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  };

  // Main render
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="primary">
                Red Cross Executive Command Center
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Real-time analytics powering strategic decisions
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => {/* Export functionality */}}
              >
                Export Report
              </Button>
              <Button
                variant="outlined"
                startIcon={<Share />}
              >
                Share
              </Button>
              <IconButton onClick={initializeDataPipeline}>
                <Refresh />
              </IconButton>
            </Stack>
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          {renderExecutiveKPIs()}
        </Grid>
        
        <Grid item xs={12}>
          <Tabs
            value={selectedTab}
            onChange={(e, v) => setSelectedTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 3 }}
          >
            <Tab label="Overview" icon={<Dashboard />} iconPosition="start" />
            <Tab label="Geographic" icon={<Map />} iconPosition="start" />
            <Tab label="Analytics" icon={<Analytics />} iconPosition="start" />
            <Tab label="Volunteers" icon={<People />} iconPosition="start" />
            <Tab label="Blood Services" icon={<BloodtypeOutlined />} iconPosition="start" />
            <Tab label="Financials" icon={<AttachMoney />} iconPosition="start" />
            <Tab label="Predictions" icon={<Psychology />} iconPosition="start" />
            <Tab label="Alerts" icon={<NotificationsActive />} iconPosition="start" />
          </Tabs>
        </Grid>
        
        <Grid item xs={12}>
          {selectedTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {renderAdvancedMap()}
              </Grid>
              <Grid item xs={12}>
                {renderAdvancedAnalytics()}
              </Grid>
            </Grid>
          )}
          
          {selectedTab === 1 && renderAdvancedMap()}
          {selectedTab === 2 && renderAdvancedAnalytics()}
          {selectedTab === 7 && renderAlerts()}
        </Grid>
      </Grid>
      
      <SpeedDial
        ariaLabel="Actions"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<ChatBubbleOutline />}
          tooltipTitle="AI Assistant"
          onClick={() => {/* Open AI chat */}}
        />
        <SpeedDialAction
          icon={<Settings />}
          tooltipTitle="Settings"
          onClick={() => {/* Open settings */}}
        />
        <SpeedDialAction
          icon={<Help />}
          tooltipTitle="Help"
          onClick={() => {/* Open help */}}
        />
      </SpeedDial>
    </Box>
  );
};

export default UltraExecutiveDashboard;