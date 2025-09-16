import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Search,
  FilterList,
  Download,
  Add
} from '@mui/icons-material';

const Volunteers = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Volunteer Management
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Comprehensive volunteer database with advanced filtering, search, and management capabilities.
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search volunteers..."
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select defaultValue="all">
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="prospective">Prospective</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Region</InputLabel>
              <Select defaultValue="all">
                <MenuItem value="all">All Regions</MenuItem>
                <MenuItem value="texas">Texas</MenuItem>
                <MenuItem value="nevada">Nevada</MenuItem>
                <MenuItem value="utah">Utah</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" startIcon={<FilterList />}>
                Filters
              </Button>
              <Button variant="outlined" startIcon={<Download />}>
                Export
              </Button>
              <Button variant="contained" startIcon={<Add />}>
                Add Volunteer
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Volunteer Database
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip label="49,247 Total" color="primary" size="small" />
            <Chip label="12,384 Active" color="success" size="small" />
            <Chip label="8,492 Inactive" color="error" size="small" />
          </Stack>
        </Box>
        
        <Box 
          sx={{ 
            height: 600, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: 'grey.50',
            borderRadius: 1,
            border: '2px dashed',
            borderColor: 'grey.300'
          }}
        >
          <Typography color="text.secondary">
            Data grid with volunteer records will be rendered here
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Volunteers;
