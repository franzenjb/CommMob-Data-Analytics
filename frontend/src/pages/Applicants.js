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
  MenuItem,
  LinearProgress
} from '@mui/material';
import {
  Search,
  FilterList,
  Download,
  Assessment
} from '@mui/icons-material';

const Applicants = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Application Pipeline
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Track and analyze volunteer applications through the complete intake and onboarding process.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
              76,384
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Applications
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
              64.5%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Conversion Rate
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="info.main" sx={{ fontWeight: 700 }}>
              12.3
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg. Days to Start
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
              8.2%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Inactive Rate
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search applications..."
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
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Workflow</InputLabel>
              <Select defaultValue="all">
                <MenuItem value="all">All Workflows</MenuItem>
                <MenuItem value="general">General Volunteer</MenuItem>
                <MenuItem value="youth">Youth Under 18</MenuItem>
                <MenuItem value="partner">Partner Organization</MenuItem>
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
              <Button variant="outlined" startIcon={<Assessment />}>
                Analytics
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Application Pipeline Flow
            </Typography>
            <Box 
              sx={{ 
                height: 400, 
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
                Pipeline flow diagram will be rendered here
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Pipeline Metrics
            </Typography>
            
            <Stack spacing={2}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Applications</Typography>
                  <Typography variant="body2">76,384</Typography>
                </Box>
                <LinearProgress variant="determinate" value={100} />
              </Box>
              
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Background Checks</Typography>
                  <Typography variant="body2">89.2%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={89.2} />
              </Box>
              
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Orientations</Typography>
                  <Typography variant="body2">76.8%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={76.8} />
              </Box>
              
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Active Volunteers</Typography>
                  <Typography variant="body2">64.5%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={64.5} />
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Applicants;
