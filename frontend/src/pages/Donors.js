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
  Stack,
  Slider
} from '@mui/material';
import { Search, FilterList, Download, Add } from '@mui/icons-material';
import dataService from '../services/dataService';
import DonorsChart from '../components/Charts/DonorsChart';

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [minAmount, setMinAmount] = useState(5000);
  const [maxAmount, setMaxAmount] = useState(100000);
  const [sortBy, setSortBy] = useState('amount');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    loadDonorsData();
  }, []);

  useEffect(() => {
    filterDonors();
  }, [donors, searchQuery, minAmount, maxAmount, sortBy, sortOrder]);

  const loadDonorsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dataService.getDonorsData();
      setDonors(data);
    } catch (err) {
      setError('Failed to load donors data');
      console.error('Error loading donors:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterDonors = async () => {
    try {
      const filters = {
        minAmount: minAmount,
        maxAmount: maxAmount
      };
      
      let filtered = await dataService.searchDonors(searchQuery, filters);
      
      // Sort the data
      filtered.sort((a, b) => {
        const amountA = parseFloat(a['Gift $ ']?.replace(/[$,]/g, '') || 0);
        const amountB = parseFloat(b['Gift $ ']?.replace(/[$,]/g, '') || 0);
        
        if (sortBy === 'amount') {
          return sortOrder === 'desc' ? amountB - amountA : amountA - amountB;
        }
        return 0;
      });
      
      setFilteredDonors(filtered);
    } catch (err) {
      console.error('Error filtering donors:', err);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getAmountValue = (giftString) => {
    return parseFloat(giftString?.replace(/[$,]/g, '') || 0);
  };

  const handleExport = () => {
    const csvContent = [
      ['Gift Amount', 'X Coordinate', 'Y Coordinate'],
      ...filteredDonors.map(donor => [
        donor['Gift $ '],
        donor.X,
        donor.Y
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'donors_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const paginatedDonors = filteredDonors.slice(
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
        Donors Management
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#FFF5F5', border: '1px solid #DC143C' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', color: '#1B365D' }}>
                Total Donors
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: 'Georgia, serif', color: '#DC143C', fontWeight: 'bold' }}>
                {donors.length.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#FFF5F5', border: '1px solid #DC143C' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', color: '#1B365D' }}>
                Total Donations
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: 'Georgia, serif', color: '#DC143C', fontWeight: 'bold' }}>
                {formatCurrency(donors.reduce((sum, d) => sum + getAmountValue(d['Gift $ ']), 0))}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#FFF5F5', border: '1px solid #DC143C' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', color: '#1B365D' }}>
                Average Gift
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: 'Georgia, serif', color: '#DC143C', fontWeight: 'bold' }}>
                {formatCurrency(donors.reduce((sum, d) => sum + getAmountValue(d['Gift $ ']), 0) / donors.length)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#FFF5F5', border: '1px solid #DC143C' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif', color: '#1B365D' }}>
                Top Gift
              </Typography>
              <Typography variant="h4" sx={{ fontFamily: 'Georgia, serif', color: '#DC143C', fontWeight: 'bold' }}>
                {formatCurrency(Math.max(...donors.map(d => getAmountValue(d['Gift $ ']))))}
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
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={3}>
            <Typography variant="body2" sx={{ fontFamily: 'Georgia, serif', color: '#1B365D', mb: 1 }}>
              Gift Amount Range: {formatCurrency(minAmount)} - {formatCurrency(maxAmount)}
            </Typography>
            <Slider
              value={[minAmount, maxAmount]}
              onChange={(e, newValue) => {
                setMinAmount(newValue[0]);
                setMaxAmount(newValue[1]);
              }}
              min={5000}
              max={100000}
              step={5000}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => formatCurrency(value)}
              sx={{ color: '#DC143C' }}
            />
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
                <MenuItem value="amount" sx={{ fontFamily: 'Georgia, serif' }}>
                  Gift Amount
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel sx={{ fontFamily: 'Georgia, serif', color: '#1B365D' }}>
                Order
              </InputLabel>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                label="Order"
                sx={{ fontFamily: 'Georgia, serif' }}
              >
                <MenuItem value="desc" sx={{ fontFamily: 'Georgia, serif' }}>
                  High to Low
                </MenuItem>
                <MenuItem value="asc" sx={{ fontFamily: 'Georgia, serif' }}>
                  Low to High
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

      {/* Donors Table */}
      <Paper sx={{ backgroundColor: '#FAFAFA' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontFamily: 'Georgia, serif', fontWeight: 'bold', color: '#1B365D' }}>
                  Gift Amount
                </TableCell>
                <TableCell sx={{ fontFamily: 'Georgia, serif', fontWeight: 'bold', color: '#1B365D' }}>
                  X Coordinate
                </TableCell>
                <TableCell sx={{ fontFamily: 'Georgia, serif', fontWeight: 'bold', color: '#1B365D' }}>
                  Y Coordinate
                </TableCell>
                <TableCell sx={{ fontFamily: 'Georgia, serif', fontWeight: 'bold', color: '#1B365D' }}>
                  Amount Category
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedDonors.map((donor, index) => {
                const amount = getAmountValue(donor['Gift $ ']);
                const category = amount >= 50000 ? 'Major' : 
                               amount >= 25000 ? 'Large' : 
                               amount >= 10000 ? 'Medium' : 'Standard';
                
                return (
                  <TableRow key={index} hover>
                    <TableCell sx={{ fontFamily: 'Georgia, serif' }}>
                      <Chip 
                        label={donor['Gift $ ']}
                        color="error"
                        sx={{ fontFamily: 'Georgia, serif', fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'Georgia, serif' }}>
                      {donor.X}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'Georgia, serif' }}>
                      {donor.Y}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'Georgia, serif' }}>
                      <Chip 
                        label={category}
                        color={category === 'Major' ? 'error' : 
                               category === 'Large' ? 'warning' : 
                               category === 'Medium' ? 'info' : 'default'}
                        size="small"
                        sx={{ fontFamily: 'Georgia, serif' }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography variant="body2" sx={{ fontFamily: 'Georgia, serif', color: '#1B365D' }}>
          Showing {currentPage * rowsPerPage + 1} to {Math.min((currentPage + 1) * rowsPerPage, filteredDonors.length)} of {filteredDonors.length} donors
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
            disabled={(currentPage + 1) * rowsPerPage >= filteredDonors.length}
            sx={{ fontFamily: 'Georgia, serif' }}
          >
            Next
          </Button>
        </Stack>
      </Box>

      {/* Analytics Charts */}
      <Box sx={{ mt: 4 }}>
        <DonorsChart />
      </Box>
    </Box>
  );
};

export default Donors;
