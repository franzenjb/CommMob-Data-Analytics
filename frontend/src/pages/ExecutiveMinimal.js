import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, LinearProgress } from '@mui/material';
import dataService from '../services/dataService';

const KPI = ({ label, value, sub }) => (
  <Paper elevation={1} style={{ padding: 16 }}>
    <Typography variant="overline" color="textSecondary">{label}</Typography>
    <Typography variant="h4" style={{ fontWeight: 800 }}>{value}</Typography>
    {sub && <Typography variant="caption" color="textSecondary">{sub}</Typography>}
  </Paper>
);

export default function ExecutiveMinimal() {
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState(null);

  useEffect(() => {
    (async () => {
      const metrics = await dataService.getDashboardMetrics();
      setKpi(metrics);
      setLoading(false);
    })();
  }, []);

  if (loading || !kpi) {
    return (
      <Box padding={3}>
        <Typography variant="h6">Loading executive metrics...</Typography>
        <LinearProgress style={{ marginTop: 12 }} />
      </Box>
    );
  }

  return (
    <Box padding={3}>
      <Typography variant="h5" style={{ fontWeight: 800, marginBottom: 12 }}>
        Executive Overview
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6} md={3}><KPI label="Volunteers" value={kpi.totalVolunteers} sub={`${kpi.activeVolunteers} active`} /></Grid>
        <Grid item xs={6} md={3}><KPI label="Applicants" value={kpi.totalApplicants} sub={`${kpi.conversionRate}% conversion`} /></Grid>
        <Grid item xs={6} md={3}><KPI label="Donations" value={`$${(kpi.totalDonations/1_000_000).toFixed(1)}M`} sub={`${kpi.totalDonors} donors`} /></Grid>
        <Grid item xs={6} md={3}><KPI label="Blood Drives" value={kpi.totalBloodDrives} sub={`${kpi.totalProductsCollected} units`} /></Grid>
      </Grid>
    </Box>
  );
}


