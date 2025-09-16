import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Chip,
  Stack,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import {
  Send,
  Lightbulb,
  TrendingUp,
  Assessment,
  Refresh
} from '@mui/icons-material';

const AIInsights = () => {
  const [query, setQuery] = useState('');

  const sampleInsights = [
    {
      title: 'Volunteer Retention Analysis',
      insight: 'Volunteers in Texas show 23% higher retention rates when they complete orientation within 7 days of application.',
      confidence: 94,
      type: 'trend'
    },
    {
      title: 'Geographic Recruitment Opportunity',
      insight: 'Dallas-Fort Worth Metro area has 15% lower application density compared to similar population centers.',
      confidence: 87,
      type: 'opportunity'
    },
    {
      title: 'Background Check Optimization',
      insight: 'Applications with completed background checks within 48 hours have 31% higher conversion rates.',
      confidence: 91,
      type: 'optimization'
    }
  ];

  const getInsightIcon = (type) => {
    switch (type) {
      case 'trend':
        return <TrendingUp sx={{ color: 'success.main' }} />;
      case 'opportunity':
        return <Lightbulb sx={{ color: 'warning.main' }} />;
      case 'optimization':
        return <Assessment sx={{ color: 'info.main' }} />;
      default:
        return <Lightbulb sx={{ color: 'primary.main' }} />;
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        AI-Powered Insights
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Ask questions about your data and get intelligent insights powered by advanced analytics and machine learning.
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Natural Language Query
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={10}>
            <TextField
              fullWidth
              placeholder="Ask a question about your data... (e.g., 'Which regions have the highest volunteer retention?')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              multiline
              rows={2}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button 
              variant="contained" 
              fullWidth
              startIcon={<Send />}
              disabled={!query.trim()}
            >
              Analyze
            </Button>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Sample questions:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip 
              label="Show volunteer distribution by state" 
              size="small" 
              onClick={() => setQuery('Show volunteer distribution by state')}
            />
            <Chip 
              label="What factors predict successful conversion?" 
              size="small"
              onClick={() => setQuery('What factors predict successful conversion?')}
            />
            <Chip 
              label="Where should we focus recruitment?" 
              size="small"
              onClick={() => setQuery('Where should we focus recruitment?')}
            />
          </Stack>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                AI Analysis Results
              </Typography>
              <IconButton size="small">
                <Refresh />
              </IconButton>
            </Box>
            
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
                AI analysis visualization will be rendered here
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Recent Insights
            </Typography>
            
            <Stack spacing={2}>
              {sampleInsights.map((insight, index) => (
                <Card key={index} variant="outlined">
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                      {getInsightIcon(insight.type)}
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, flexGrow: 1 }}>
                        {insight.title}
                      </Typography>
                      <Chip 
                        label={`${insight.confidence}%`} 
                        size="small" 
                        color="success"
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {insight.insight}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AIInsights;
