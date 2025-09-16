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

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [workflowFilter, setWorkflowFilter] = useState('all');

  useEffect(() => {
    loadApplicants();
  }, []);

  useEffect(() => {
    filterApplicants();
  }, [applicants, searchQuery, statusFilter, workflowFilter]);

  const loadApplicants = async () => {
    try {
      setLoading(true);
      const data = await dataService.getApplicantData();
      setApplicants(data);
      console.log(`Loaded ${data.length} applicants`);
    } catch (err) {
      setError('Failed to load applicant data');
      console.error('Error loading applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterApplicants = () => {
    let filtered = applicants;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(a => {
        const searchText = `${a.City} ${a.State} ${a['Current Status']} ${a['Workflow Type']}`.toLowerCase();
        return searchText.includes(searchQuery.toLowerCase());
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a['Current Status'] === statusFilter);
    }

    // Workflow filter
    if (workflowFilter !== 'all') {
      filtered = filtered.filter(a => a['Workflow Type'] === workflowFilter);
    }

    setFilteredApplicants(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'General Volunteer': return 'success';
      case 'Inactive Prospective Volunteer': return 'warning';
      case 'Lapsed Volunteer': return 'error';
      default: return 'default';
    }
  };

  const uniqueStatuses = [...new Set(applicants.map(a => a['Current Status']))].filter(Boolean);
  const uniqueWorkflows = [...new Set(applicants.map(a => a['Workflow Type']))].filter(Boolean);
  const uniqueStates = [...new Set(applicants.map(a => a.State))].filter(Boolean);

  const convertedApplicants = applicants.filter(a => a['Current Status'] === 'General Volunteer').length;
  const inactiveApplicants = applicants.filter(a => a['Current Status'] === 'Inactive Prospective Volunteer').length;
  const lapsedApplicants = applicants.filter(a => a['Current Status'] === 'Lapsed Volunteer').length;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading applicant data...
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
        Application Pipeline
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Comprehensive application tracking with {applicants.length.toLocaleString()} records and conversion analytics.
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Applications
              </Typography>
              <Typography variant="h4" color="primary">
                {applicants.length.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Converted to Volunteers
              </Typography>
              <Typography variant="h4" color="success.main">
                {convertedApplicants.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Inactive Applications
              </Typography>
              <Typography variant="h4" color="warning.main">
                {inactiveApplicants.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Conversion Rate
              </Typography>
              <Typography variant="h4" color="info.main">
                {((convertedApplicants / applicants.length) * 100).toFixed(1)}%
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
                placeholder="Search applications..."
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
                <InputLabel>Workflow</InputLabel>
                <Select
                  value={workflowFilter}
                  onChange={(e) => setWorkflowFilter(e.target.value)}
                  label="Workflow"
                >
                  <MenuItem value="all">All Workflows</MenuItem>
                  {uniqueWorkflows.map(workflow => (
                    <MenuItem key={workflow} value={workflow}>{workflow}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Stack direction="row" spacing={1}>
                <Chip
                  icon={<FilterList />}
                  label={`${filteredApplicants.length} results`}
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

      {/* Applicants Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Application Database
            </Typography>
            <Button variant="contained" startIcon={<Add />}>
              Add Application
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Location</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Workflow</TableCell>
                  <TableCell>Application Date</TableCell>
                  <TableCell>Volunteer Start</TableCell>
                  <TableCell>Days to Start</TableCell>
                  <TableCell>BGC Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplicants.slice(0, 100).map((applicant, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      {applicant.City && applicant.State ? `${applicant.City}, ${applicant.State}` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={applicant['Current Status'] || 'Unknown'}
                        color={getStatusColor(applicant['Current Status'])}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{applicant['Workflow Type'] || 'N/A'}</TableCell>
                    <TableCell>
                      {applicant['Application Dt'] ? 
                        new Date(applicant['Application Dt']).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {applicant['Vol Start Dt'] ? 
                        new Date(applicant['Vol Start Dt']).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {applicant['Days To Vol Start'] || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={applicant['BGC Status'] || 'N/A'}
                        color={applicant['BGC Status'] === 'Completed' ? 'success' : 'default'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {filteredApplicants.length > 100 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Showing first 100 results of {filteredApplicants.length.toLocaleString()} applications
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Applicants;