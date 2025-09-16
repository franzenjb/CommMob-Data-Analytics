import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import dataService from '../services/dataService';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('status');

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const data = await dataService.getAnalyticsData();
      setAnalyticsData(data);
      console.log('Loaded analytics data:', data);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#DC143C', '#1B365D', '#F7F7F7', '#FFD700', '#32CD32', '#FF6347', '#A9A9A9'];

  const prepareStatusData = () => {
    if (!analyticsData?.statusDistribution) return [];
    
    return Object.entries(analyticsData.statusDistribution).map(([status, count]) => ({
      name: status,
      value: count,
      percentage: ((count / Object.values(analyticsData.statusDistribution).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
    }));
  };

  const prepareGeographicData = () => {
    if (!analyticsData?.geographicDistribution) return [];
    
    return Object.entries(analyticsData.geographicDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([state, count]) => ({
        name: state,
        value: count
      }));
  };

  const prepareTimeSeriesData = () => {
    if (!analyticsData?.timeSeriesData) return [];
    
    return Object.entries(analyticsData.timeSeriesData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({
        month: month,
        applications: count
      }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading analytics data...
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

  const statusData = prepareStatusData();
  const geographicData = prepareGeographicData();
  const timeSeriesData = prepareTimeSeriesData();

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Advanced Analytics
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Comprehensive data analysis and insights from volunteer and applicant data.
      </Typography>

      {/* Chart Type Selector */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Chart Type</InputLabel>
            <Select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              label="Chart Type"
            >
              <MenuItem value="status">Status Distribution</MenuItem>
              <MenuItem value="geographic">Geographic Distribution</MenuItem>
              <MenuItem value="timeline">Application Timeline</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Main Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {chartType === 'status' && 'Volunteer Status Distribution'}
                {chartType === 'geographic' && 'Top 10 States by Volunteer Count'}
                {chartType === 'timeline' && 'Application Timeline'}
              </Typography>
              
              <Box sx={{ height: 400 }}>
                {chartType === 'status' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}

                {chartType === 'geographic' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={geographicData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#DC143C" />
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {chartType === 'timeline' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="applications" stroke="#DC143C" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Summary Stats */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Key Metrics
              </Typography>
              
              {chartType === 'status' && (
                <Box>
                  {statusData.map((item, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            backgroundColor: COLORS[index % COLORS.length],
                            borderRadius: '50%',
                            mr: 1
                          }}
                        />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                      </Box>
                      <Typography variant="h6" color="primary">
                        {item.value.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.percentage}% of total
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {chartType === 'geographic' && (
                <Box>
                  {geographicData.slice(0, 5).map((item, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {item.value.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        volunteers
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {chartType === 'timeline' && (
                <Box>
                  <Box sx={{ mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Total Applications
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {timeSeriesData.reduce((sum, item) => sum + item.applications, 0).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Average Monthly
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {Math.round(timeSeriesData.reduce((sum, item) => sum + item.applications, 0) / timeSeriesData.length).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Peak Month
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {timeSeriesData.reduce((max, item) => item.applications > max.applications ? item : max, {applications: 0}).month}
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Charts */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Status Distribution (Bar Chart)
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#DC143C" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Geographic Distribution
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={geographicData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#1B365D" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;