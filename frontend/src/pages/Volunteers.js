import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Stack
} from '@mui/material';
import { Search, FilterList, Download, Add } from '@mui/icons-material';
import dataService from '../services/dataService';

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');

  useEffect(() => {
    loadVolunteers();
  }, []);

  useEffect(() => {
    filterVolunteers();
  }, [volunteers, searchQuery, statusFilter, regionFilter]);

  const loadVolunteers = async () => {
    try {
      setLoading(true);
      const data = await dataService.getVolunteerData();
      setVolunteers(data);
      console.log(`Loaded ${data.length} volunteers`);
    } catch (err) {
      setError('Failed to load volunteer data');
      console.error('Error loading volunteers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterVolunteers = () => {
    let filtered = volunteers;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(v => {
        const searchText = `${v['Chapter Name']} ${v.State} ${v['Current Status']} ${v['Current Positions']}`.toLowerCase();
        return searchText.includes(searchQuery.toLowerCase());
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(v => v['Current Status'] === statusFilter);
    }

    // Region filter
    if (regionFilter !== 'all') {
      filtered = filtered.filter(v => v.State === regionFilter);
    }

    setFilteredVolunteers(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'General Volunteer': return 'success';
      case 'Prospective Volunteer': return 'warning';
      case 'Youth Under 18': return 'info';
      case 'Employee': return 'primary';
      case 'Event Based Volunteer': return 'secondary';
      default: return 'default';
    }
  };

  const uniqueStatuses = [...new Set(volunteers.map(v => v['Current Status']))].filter(Boolean);
  const uniqueRegions = [...new Set(volunteers.map(v => v.State))].filter(Boolean);

  const activeVolunteers = volunteers.filter(v => v['Current Status'] === 'General Volunteer').length;
  const inactiveVolunteers = volunteers.filter(v => v['Current Status'] === 'Prospective Volunteer').length;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading volunteer data...
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
        Volunteer Management
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Comprehensive volunteer database with {volunteers.length.toLocaleString()} records and advanced filtering capabilities.
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Volunteers
              </Typography>
              <Typography variant="h4" color="primary">
                {volunteers.length.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Active Volunteers
              </Typography>
              <Typography variant="h4" color="success.main">
                {activeVolunteers.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Prospective
              </Typography>
              <Typography variant="h4" color="warning.main">
                {inactiveVolunteers.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Regions Covered
              </Typography>
              <Typography variant="h4" color="info.main">
                {uniqueRegions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search volunteers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  {uniqueStatuses.map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Region</InputLabel>
                <Select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  label="Region"
                >
                  <MenuItem value="all">All Regions</MenuItem>
                  {uniqueRegions.map(region => (
                    <MenuItem key={region} value={region}>{region}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Stack direction="row" spacing={1}>
                <Chip
                  icon={<FilterList />}
                  label={`${filteredVolunteers.length} results`}
                  color="primary"
                  variant="outlined"
                />
                <Button variant="outlined" startIcon={<Download />} size="small">
                  Export
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Volunteers Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Volunteer Database
            </Typography>
            <Button variant="contained" startIcon={<Add />}>
              Add Volunteer
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Chapter</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>State</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Volunteer Since</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVolunteers.slice(0, 100).map((volunteer, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{volunteer['Chapter Name'] || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip
                        label={volunteer['Current Status'] || 'Unknown'}
                        color={getStatusColor(volunteer['Current Status'])}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{volunteer.State || 'N/A'}</TableCell>
                    <TableCell>{volunteer['Current Positions'] || 'N/A'}</TableCell>
                    <TableCell>{volunteer['Last Login'] || 'N/A'}</TableCell>
                    <TableCell>{volunteer['Volunteer Since Date'] || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {filteredVolunteers.length > 100 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Showing first 100 results of {filteredVolunteers.length.toLocaleString()} volunteers
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Volunteers;