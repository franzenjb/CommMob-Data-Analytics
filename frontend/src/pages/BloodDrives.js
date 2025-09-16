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
import BiomedChart from '../components/Charts/BiomedChart';

const BloodDrives = () => {
  const [bloodDrives, setBloodDrives] = useState([]);
  const [filteredDrives, setFilteredDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [accountTypeFilter, setAccountTypeFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [sortBy, setSortBy] = useState('productsCollected');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    loadBloodDrivesData();
  }, []);

  useEffect(() => {
    filterBloodDrives();
  }, [bloodDrives, searchQuery, statusFilter, accountTypeFilter, yearFilter, sortBy, sortOrder]);

  const loadBloodDrivesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dataService.getBiomedData();
      setBloodDrives(data);
    } catch (err) {
      setError('Failed to load blood drives data');
      console.error('Error loading blood drives:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterBloodDrives = async () => {
    try {
      const filters = {
        status: statusFilter,
        accountType: accountTypeFilter,
        year: yearFilter
      };
      
      let filtered = await dataService.searchBloodDrives(searchQuery, filters);
      
      // Sort the data
      filtered.sort((a, b) => {
        const productsA = parseInt(a['RBC Products Collected']) || 0;
        const productsB = parseInt(b['RBC Products Collected']) || 0;
        
        if (sortBy === 'productsCollected') {
          return sortOrder === 'desc' ? productsB - productsA : productsA - productsB;
        } else if (sortBy === 'accountName') {
          return sortOrder === 'desc' ? 
            b['Account Name'].localeCompare(a['Account Name']) : 
            a['Account Name'].localeCompare(b['Account Name']);
        }
        return 0;
      });
      
      setFilteredDrives(filtered);
    } catch (err) {
      console.error('Error filtering blood drives:', err);
    }
  };

  const getUniqueValues = (field) => {
    return [...new Set(bloodDrives.map(drive => drive[field]).filter(Boolean))].sort();
  };

  const handleExport = () => {
    const csvContent = [
      ['Year', 'Account Name', 'Account Type', 'Status', 'Address', 'City', 'State', 'Zip', 'Drives', 'Products Projected', 'Products Collected'],
      ...filteredDrives.map(drive => [
        drive.Year,
        drive['Account Name'],
        drive['Account Type'],
        drive.Status,
        drive.Address,
        drive.City,
        drive.St,
        drive.Zip,
        drive.Drives,
        drive['RBC Product Projection'],
        drive['RBC Products Collected']
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blood_drives_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const paginatedDrives = filteredDrives.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontFamily: 'Georgia, serif', color: '#1B365D' }}>
        Blood Drives Management
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
                {bloodDrives.length.toLocaleString()}
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
                {bloodDrives.reduce((sum, d) => sum + (parseInt(d['RBC Products Collected']) || 0), 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#FFF5F5', border: '1px solid #DC143C' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', color: '#1B365D' }}>
                Completed Drives
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: 'Georgia, serif', color: '#DC143C', fontWeight: 'bold' }}>
                {bloodDrives.filter(d => d.Status === 'Complete').length.toLocaleString()}
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
                {(bloodDrives.reduce((sum, d) => sum + (parseInt(d['RBC Products Collected']) || 0), 0) / bloodDrives.length).toFixed(1)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: '#FAFAFA' }}>
        <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Georgia, serif', color: '#1B365D' }}>
          Filters
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: '#DC143C' }} />
              }}
              sx={{ fontFamily: 'Georgia, serif' }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel sx={{ fontFamily: 'Georgia, serif', color: '#1B365D' }}>
                Status
              </InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
                sx={{ fontFamily: 'Georgia, serif' }}
              >
                <MenuItem value="all" sx={{ fontFamily: 'Georgia, serif' }}>
                  All Statuses
                </MenuItem>
                {getUniqueValues('Status').map(status => (
                  <MenuItem key={status} value={status} sx={{ fontFamily: 'Georgia, serif' }}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel sx={{ fontFamily: 'Georgia, serif', color: '#1B365D' }}>
                Account Type
              </InputLabel>
              <Select
                value={accountTypeFilter}
                onChange={(e) => setAccountTypeFilter(e.target.value)}
                label="Account Type"
                sx={{ fontFamily: 'Georgia, serif' }}
              >
                <MenuItem value="all" sx={{ fontFamily: 'Georgia, serif' }}>
                  All Types
                </MenuItem>
                {getUniqueValues('Account Type').map(type => (
                  <MenuItem key={type} value={type} sx={{ fontFamily: 'Georgia, serif' }}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel sx={{ fontFamily: 'Georgia, serif', color: '#1B365D' }}>
                Year
              </InputLabel>
              <Select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                label="Year"
                sx={{ fontFamily: 'Georgia, serif' }}
              >
                <MenuItem value="all" sx={{ fontFamily: 'Georgia, serif' }}>
                  All Years
                </MenuItem>
                {getUniqueValues('Year').map(year => (
                  <MenuItem key={year} value={year} sx={{ fontFamily: 'Georgia, serif' }}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel sx={{ fontFamily: 'Georgia, serif', color: '#1B365D' }}>
                Sort By
              </InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
                sx={{ fontFamily: 'Georgia, serif' }}
              >
                <MenuItem value="productsCollected" sx={{ fontFamily: 'Georgia, serif' }}>
                  Products Collected
                </MenuItem>
                <MenuItem value="accountName" sx={{ fontFamily: 'Georgia, serif' }}>
                  Account Name
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleExport}
              sx={{
                backgroundColor: '#DC143C',
                fontFamily: 'Georgia, serif',
                '&:hover': { backgroundColor: '#B22222' }
              }}
            >
              Export
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Blood Drives Table */}
      <Paper sx={{ backgroundColor: '#FAFAFA' }}>
        <TableContainer>
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
                  Status
                </TableCell>
                <TableCell sx={{ fontFamily: 'Georgia, serif', fontWeight: 'bold', color: '#1B365D' }}>
                  Location
                </TableCell>
                <TableCell sx={{ fontFamily: 'Georgia, serif', fontWeight: 'bold', color: '#1B365D' }}>
                  Products Collected
                </TableCell>
                <TableCell sx={{ fontFamily: 'Georgia, serif', fontWeight: 'bold', color: '#1B365D' }}>
                  Year
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedDrives.map((drive, index) => (
                <TableRow key={index} hover>
                  <TableCell sx={{ fontFamily: 'Georgia, serif' }}>
                    {drive['Account Name']}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Georgia, serif' }}>
                    <Chip 
                      label={drive['Account Type']}
                      size="small"
                      sx={{ fontFamily: 'Georgia, serif' }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Georgia, serif' }}>
                    <Chip 
                      label={drive.Status}
                      color={drive.Status === 'Complete' ? 'success' : 'warning'}
                      size="small"
                      sx={{ fontFamily: 'Georgia, serif' }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Georgia, serif' }}>
                    {drive.City}, {drive.St}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Georgia, serif' }}>
                    <Chip 
                      label={drive['RBC Products Collected']}
                      color="error"
                      sx={{ fontFamily: 'Georgia, serif', fontWeight: 'bold' }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Georgia, serif' }}>
                    {drive.Year}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography variant="body2" sx={{ fontFamily: 'Georgia, serif', color: '#1B365D' }}>
          Showing {currentPage * rowsPerPage + 1} to {Math.min((currentPage + 1) * rowsPerPage, filteredDrives.length)} of {filteredDrives.length} blood drives
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            sx={{ fontFamily: 'Georgia, serif' }}
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={(currentPage + 1) * rowsPerPage >= filteredDrives.length}
            sx={{ fontFamily: 'Georgia, serif' }}
          >
            Next
          </Button>
        </Stack>
      </Box>

      {/* Analytics Charts */}
      <Box sx={{ mt: 4 }}>
        <BiomedChart />
      </Box>
    </Box>
  );
};

export default BloodDrives;
