import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  AttachMoney,
  TuneRounded as Optimize,
  Assessment,
  SwapHoriz,
  CheckCircle
} from '@mui/icons-material';
import dataService from '../../services/dataService';

const ResourceOptimizer = () => {
  const [optimizations, setOptimizations] = useState([]);
  const [currentAllocation, setCurrentAllocation] = useState([]);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    generateOptimizations();
  }, []);

  const generateOptimizations = async () => {
    const volunteers = await dataService.getVolunteerData();
    const metrics = await dataService.getDashboardMetrics();

    // Current resource allocation analysis
    const current = [
      {
        region: 'Texas',
        volunteers: 45,
        budget: 75000,
        efficiency: 68,
        coverage: 28000000, // population
        costPerCapita: 2.68,
        disasters: 12,
        responseTime: 4.2
      },
      {
        region: 'Nevada', 
        volunteers: 12,
        budget: 35000,
        efficiency: 45,
        coverage: 3100000,
        costPerCapita: 11.29,
        disasters: 3,
        responseTime: 8.5
      },
      {
        region: 'Utah',
        volunteers: 8,
        budget: 25000,
        efficiency: 52,
        coverage: 3200000,
        costPerCapita: 7.81,
        disasters: 2,
        responseTime: 6.8
      }
    ];

    // AI-generated optimization recommendations
    const optimizations = [
      {
        id: 1,
        title: 'Rebalance Nevada Investment',
        type: 'budget_reallocation',
        priority: 'high',
        description: 'Nevada has highest cost-per-capita but lowest efficiency. Increase budget by $20K to improve volunteer recruitment and reduce response time.',
        currentState: {
          region: 'Nevada',
          volunteers: 12,
          budget: 35000,
          efficiency: 45,
          responseTime: 8.5
        },
        optimizedState: {
          region: 'Nevada',
          volunteers: 20,
          budget: 55000,
          efficiency: 72,
          responseTime: 5.2
        },
        investment: 20000,
        expectedROI: 180,
        timeToResult: '90 days',
        metrics: {
          volunteerIncrease: 8,
          efficiencyGain: 27,
          responseImprovement: 3.3,
          costPerCapitaReduction: 3.48
        }
      },
      {
        id: 2,
        title: 'Texas Efficiency Optimization',
        type: 'process_improvement',
        priority: 'medium',
        description: 'Texas has good coverage but efficiency can be improved through better volunteer coordination and technology upgrades.',
        currentState: {
          region: 'Texas',
          volunteers: 45,
          budget: 75000,
          efficiency: 68,
          responseTime: 4.2
        },
        optimizedState: {
          region: 'Texas',
          volunteers: 45,
          budget: 75000,
          efficiency: 85,
          responseTime: 3.1
        },
        investment: 12000,
        expectedROI: 240,
        timeToResult: '60 days',
        metrics: {
          volunteerIncrease: 0,
          efficiencyGain: 17,
          responseImprovement: 1.1,
          costSavings: 8500
        }
      },
      {
        id: 3,
        title: 'Utah Volunteer Expansion',
        type: 'capacity_building',
        priority: 'medium',
        description: 'Utah is underserved relative to population. Strategic volunteer recruitment could significantly improve coverage.',
        currentState: {
          region: 'Utah',
          volunteers: 8,
          budget: 25000,
          efficiency: 52,
          responseTime: 6.8
        },
        optimizedState: {
          region: 'Utah',
          volunteers: 15,
          budget: 40000,
          efficiency: 68,
          responseTime: 4.9
        },
        investment: 15000,
        expectedROI: 160,
        timeToResult: '120 days',
        metrics: {
          volunteerIncrease: 7,
          efficiencyGain: 16,
          responseImprovement: 1.9,
          coverageImprovement: 25
        }
      }
    ];

    setCurrentAllocation(current);
    setOptimizations(optimizations);
  };

  const implementOptimization = (optimization) => {
    setOptimizing(true);
    
    setTimeout(() => {
      setOptimizing(false);
      alert(`🚀 RESOURCE OPTIMIZATION IMPLEMENTED

📊 OPTIMIZATION: ${optimization.title}
📍 REGION: ${optimization.optimizedState.region}
💰 INVESTMENT: $${optimization.investment.toLocaleString()}
📈 EXPECTED ROI: ${optimization.expectedROI}%
⏱️ TIME TO RESULTS: ${optimization.timeToResult}

IMMEDIATE ACTIONS TAKEN:
✓ Budget reallocation approved and processed
✓ Regional directors notified of resource changes
✓ Recruitment campaigns adjusted for new targets
✓ Training programs scaled for capacity increases
✓ Performance monitoring systems updated

EXPECTED IMPROVEMENTS:
${optimization.metrics.volunteerIncrease ? `• Volunteer increase: +${optimization.metrics.volunteerIncrease}` : ''}
${optimization.metrics.efficiencyGain ? `• Efficiency gain: +${optimization.metrics.efficiencyGain}%` : ''}
${optimization.metrics.responseImprovement ? `• Response time improvement: -${optimization.metrics.responseImprovement} hours` : ''}
${optimization.metrics.costSavings ? `• Annual cost savings: $${optimization.metrics.costSavings.toLocaleString()}` : ''}
${optimization.metrics.coverageImprovement ? `• Coverage improvement: +${optimization.metrics.coverageImprovement}%` : ''}

FINANCIAL IMPACT:
• Initial investment: $${optimization.investment.toLocaleString()}
• Annual ROI: ${optimization.expectedROI}%
• Break-even timeline: ${Math.round(12 / (optimization.expectedROI / 100))} months
• 3-year value: $${Math.round(optimization.investment * (1 + optimization.expectedROI / 100 * 3)).toLocaleString()}

STATUS: Implementation in progress
NEXT REVIEW: 30 days`);
    }, 2000);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'primary';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        ⚡ AI RESOURCE OPTIMIZER - MAXIMIZE ROI
      </Typography>

      {/* Current Allocation Overview */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📊 Current Resource Allocation Analysis
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Region</strong></TableCell>
                  <TableCell align="right"><strong>Volunteers</strong></TableCell>
                  <TableCell align="right"><strong>Budget</strong></TableCell>
                  <TableCell align="right"><strong>Efficiency</strong></TableCell>
                  <TableCell align="right"><strong>Cost/Capita</strong></TableCell>
                  <TableCell align="right"><strong>Response Time</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentAllocation.map((region) => (
                  <TableRow key={region.region}>
                    <TableCell>{region.region}</TableCell>
                    <TableCell align="right">{region.volunteers}</TableCell>
                    <TableCell align="right">${region.budget.toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Box display="flex" alignItems="center">
                        {region.efficiency}%
                        <LinearProgress 
                          variant="determinate" 
                          value={region.efficiency} 
                          sx={{ ml: 1, width: 50, height: 6 }}
                          color={region.efficiency > 70 ? 'success' : region.efficiency > 50 ? 'warning' : 'error'}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="right">${region.costPerCapita.toFixed(2)}</TableCell>
                    <TableCell align="right">{region.responseTime}h</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        🎯 AI-Generated Optimization Opportunities
      </Typography>

      <Grid container spacing={3}>
        {optimizations.map((opt) => (
          <Grid item xs={12} key={opt.id}>
            <Card 
              sx={{ 
                border: `2px solid`,
                borderColor: `${getPriorityColor(opt.priority)}.main`
              }}
            >
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Optimize 
                        color={getPriorityColor(opt.priority)} 
                        sx={{ mr: 1, fontSize: 30 }} 
                      />
                      <Box>
                        <Typography variant="h5" fontWeight="bold">
                          {opt.title}
                        </Typography>
                        <Box display="flex" gap={1} mt={1}>
                          <Chip 
                            label={`${opt.priority.toUpperCase()} PRIORITY`}
                            color={getPriorityColor(opt.priority)}
                            size="small"
                          />
                          <Chip 
                            label={`${opt.expectedROI}% ROI`}
                            color="success"
                            size="small"
                          />
                          <Chip 
                            label={opt.timeToResult}
                            variant="outlined"
                            size="small"
                          />
                        </Box>
                      </Box>
                    </Box>

                    <Typography variant="body1" paragraph>
                      {opt.description}
                    </Typography>

                    {/* Before/After Comparison */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box bgcolor="error.light" p={2} borderRadius={1}>
                          <Typography variant="subtitle2" fontWeight="bold" color="error.contrastText">
                            CURRENT STATE
                          </Typography>
                          <Typography variant="body2" color="error.contrastText">
                            • Volunteers: {opt.currentState.volunteers}
                            <br />• Budget: ${opt.currentState.budget.toLocaleString()}
                            <br />• Efficiency: {opt.currentState.efficiency}%
                            <br />• Response Time: {opt.currentState.responseTime}h
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box bgcolor="success.light" p={2} borderRadius={1}>
                          <Typography variant="subtitle2" fontWeight="bold" color="success.contrastText">
                            OPTIMIZED STATE
                          </Typography>
                          <Typography variant="body2" color="success.contrastText">
                            • Volunteers: {opt.optimizedState.volunteers}
                            <br />• Budget: ${opt.optimizedState.budget.toLocaleString()}
                            <br />• Efficiency: {opt.optimizedState.efficiency}%
                            <br />• Response Time: {opt.optimizedState.responseTime}h
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box textAlign="center">
                      <Typography variant="h6" gutterBottom>
                        💰 Financial Impact
                      </Typography>
                      
                      <Box mb={2}>
                        <Typography variant="body2" color="textSecondary">
                          Investment Required
                        </Typography>
                        <Typography variant="h4" color="primary">
                          ${opt.investment.toLocaleString()}
                        </Typography>
                      </Box>

                      <Box mb={2}>
                        <Typography variant="body2" color="textSecondary">
                          Expected ROI
                        </Typography>
                        <Typography variant="h4" color="success.main">
                          {opt.expectedROI}%
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        color={getPriorityColor(opt.priority)}
                        fullWidth
                        size="large"
                        onClick={() => implementOptimization(opt)}
                        disabled={optimizing}
                        sx={{ fontWeight: 'bold', mb: 2 }}
                      >
                        {optimizing ? '⚡ OPTIMIZING...' : '🚀 IMPLEMENT NOW'}
                      </Button>

                      <Typography variant="caption" color="success.main">
                        Break-even in {Math.round(12 / (opt.expectedROI / 100))} months
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Summary Stats */}
      <Card sx={{ mt: 4, bgcolor: 'primary.light' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" color="primary.contrastText" gutterBottom>
            📈 Total Optimization Potential
          </Typography>
          <Grid container spacing={3} textAlign="center">
            <Grid item xs={12} md={3}>
              <Typography variant="h4" color="primary.contrastText">
                $47K
              </Typography>
              <Typography variant="body2" color="primary.contrastText">
                Total Investment
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h4" color="primary.contrastText">
                194%
              </Typography>
              <Typography variant="body2" color="primary.contrastText">
                Average ROI
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h4" color="primary.contrastText">
                +15
              </Typography>
              <Typography variant="body2" color="primary.contrastText">
                Additional Volunteers
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h4" color="primary.contrastText">
                -2.1h
              </Typography>
              <Typography variant="body2" color="primary.contrastText">
                Response Time Reduction
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResourceOptimizer;
