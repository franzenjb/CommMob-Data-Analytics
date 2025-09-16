import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Warning as Emergency,
  LocationOn,
  People,
  AccessTime,
  Warning,
  CheckCircle
} from '@mui/icons-material';
import dataService from '../../services/dataService';

const CrisisCommandCenter = () => {
  const [crisisData, setCrisisData] = useState(null);
  const [deploymentStatus, setDeploymentStatus] = useState('ready');
  const [availableVolunteers, setAvailableVolunteers] = useState([]);

  useEffect(() => {
    loadCrisisData();
  }, []);

  const loadCrisisData = async () => {
    const volunteers = await dataService.getVolunteerData();
    const geographic = await dataService.getGeographicData();
    
    // Simulate crisis scenario - Hurricane approaching Texas
    const crisis = {
      type: 'Hurricane',
      name: 'Hurricane Sarah',
      location: 'Texas Gulf Coast',
      severity: 'Category 3',
      impactRadius: 200, // miles
      estimatedAffected: 2500000,
      timeToImpact: '18 hours',
      coordinates: [29.7604, -95.3698] // Houston
    };

    // Find volunteers within deployment range
    const deployableVolunteers = volunteers.filter(v => {
      if (!v.x || !v.y) return false;
      const distance = calculateDistance(
        parseFloat(v.y), parseFloat(v.x),
        crisis.coordinates[0], crisis.coordinates[1]
      );
      return distance <= 500 && v['Current Status'] === 'General Volunteer';
    });

    setCrisisData(crisis);
    setAvailableVolunteers(deployableVolunteers);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const deployVolunteers = () => {
    setDeploymentStatus('deploying');
    
    // Simulate deployment process
    setTimeout(() => {
      setDeploymentStatus('deployed');
      alert(`🚨 CRISIS DEPLOYMENT INITIATED

📍 TARGET: ${crisisData.name} - ${crisisData.location}
👥 VOLUNTEERS DEPLOYED: ${availableVolunteers.length}
⏱️ ESTIMATED ARRIVAL: 4-8 hours
📱 COMMUNICATION: Emergency frequencies activated
🚛 SUPPLIES: Mobile units dispatched
📊 COMMAND CENTER: Activated in Houston

DEPLOYMENT STATUS: ACTIVE
All volunteers have been notified via emergency alert system.
Regional coordinators have been activated.
Supply chain has been notified for emergency provisions.

NEXT ACTIONS:
✓ Monitor volunteer arrival times
✓ Coordinate with local emergency management
✓ Prepare evacuation centers
✓ Activate media communications plan`);
    }, 2000);
  };

  const getReadinessLevel = () => {
    if (!availableVolunteers.length) return { level: 'Critical', color: 'error', percent: 25 };
    if (availableVolunteers.length < 10) return { level: 'Low', color: 'warning', percent: 50 };
    if (availableVolunteers.length < 20) return { level: 'Good', color: 'info', percent: 75 };
    return { level: 'Excellent', color: 'success', percent: 95 };
  };

  if (!crisisData) return <Typography>Loading Crisis Command Center...</Typography>;

  const readiness = getReadinessLevel();

  return (
    <Box>
      <Typography variant="h4" gutterBottom color="error" sx={{ fontWeight: 'bold' }}>
        🚨 CRISIS RESPONSE COMMAND CENTER
      </Typography>

      {/* Active Crisis Alert */}
      <Alert severity="error" sx={{ mb: 3, fontSize: '1.1rem' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          ACTIVE THREAT: {crisisData.name} ({crisisData.severity})
        </Typography>
        <Typography>
          📍 {crisisData.location} • 👥 {crisisData.estimatedAffected.toLocaleString()} people at risk • ⏱️ Impact in {crisisData.timeToImpact}
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Deployment Readiness */}
        <Grid item xs={12} md={4}>
          <Card sx={{ border: `2px solid`, borderColor: `${readiness.color}.main` }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Emergency color={readiness.color} sx={{ mr: 1, fontSize: 30 }} />
                <Typography variant="h6">Deployment Readiness</Typography>
              </Box>
              <Typography variant="h3" color={`${readiness.color}.main`} gutterBottom>
                {readiness.level}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={readiness.percent} 
                color={readiness.color}
                sx={{ height: 8, borderRadius: 4, mb: 2 }}
              />
              <Typography variant="body2">
                {availableVolunteers.length} volunteers ready for immediate deployment
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Available Resources */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <People color="primary" sx={{ mr: 1, fontSize: 30 }} />
                <Typography variant="h6">Available Resources</Typography>
              </Box>
              <Typography variant="h3" color="primary" gutterBottom>
                {availableVolunteers.length}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Volunteers within 500-mile radius
              </Typography>
              <Box mt={2}>
                <Chip label="Disaster Response Certified" size="small" sx={{ mr: 1, mb: 1 }} />
                <Chip label="Emergency Communications" size="small" sx={{ mr: 1, mb: 1 }} />
                <Chip label="Mass Care" size="small" sx={{ mr: 1, mb: 1 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Deployment Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'action.hover' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AccessTime color="warning" sx={{ mr: 1, fontSize: 30 }} />
                <Typography variant="h6">Immediate Actions</Typography>
              </Box>
              
              {deploymentStatus === 'ready' && (
                <Button
                  variant="contained"
                  color="error"
                  size="large"
                  fullWidth
                  onClick={deployVolunteers}
                  sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 'bold' }}
                >
                  🚨 DEPLOY ALL VOLUNTEERS
                </Button>
              )}

              {deploymentStatus === 'deploying' && (
                <Box textAlign="center">
                  <LinearProgress color="warning" sx={{ mb: 2 }} />
                  <Typography color="warning.main" fontWeight="bold">
                    DEPLOYING VOLUNTEERS...
                  </Typography>
                </Box>
              )}

              {deploymentStatus === 'deployed' && (
                <Box textAlign="center">
                  <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography color="success.main" fontWeight="bold">
                    DEPLOYMENT ACTIVE
                  </Typography>
                </Box>
              )}

              <Button variant="outlined" fullWidth sx={{ mb: 1 }}>
                📞 Activate Emergency Comms
              </Button>
              <Button variant="outlined" fullWidth sx={{ mb: 1 }}>
                🚛 Deploy Mobile Units
              </Button>
              <Button variant="outlined" fullWidth>
                📺 Issue Media Statement
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Geographic Intelligence */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📍 Geographic Deployment Intelligence
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box bgcolor="error.light" p={2} borderRadius={1}>
                    <Typography variant="subtitle1" fontWeight="bold" color="error.contrastText">
                      HIGH PRIORITY ZONES
                    </Typography>
                    <Typography variant="body2" color="error.contrastText">
                      • Houston Metro: 15 volunteers, 4-hour deployment
                      • Galveston County: 8 volunteers, 2-hour deployment  
                      • Beaumont Area: 6 volunteers, 3-hour deployment
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box bgcolor="success.light" p={2} borderRadius={1}>
                    <Typography variant="subtitle1" fontWeight="bold" color="success.contrastText">
                      SUPPORT ZONES
                    </Typography>
                    <Typography variant="body2" color="success.contrastText">
                      • Austin: 12 volunteers, 6-hour deployment
                      • San Antonio: 18 volunteers, 8-hour deployment
                      • Dallas: 25 volunteers, 10-hour deployment
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CrisisCommandCenter;
