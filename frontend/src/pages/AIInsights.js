import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import {
  Send,
  Lightbulb,
  TrendingUp,
  Assessment,
  Psychology,
  AutoAwesome
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import cloudflareAI from '../services/cloudflareAI';
import dataService from '../services/dataService';

const AIInsights = () => {
  const [query, setQuery] = useState('');
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const data = await dataService.getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Error loading metrics:', err);
    }
  };

  const handleQuerySubmit = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await cloudflareAI.processNaturalLanguageQuery(query, metrics || {});
      
      const newInsight = {
        id: Date.now(),
        query: query,
        insights: response.insights || [],
        recommendations: response.recommendations || [],
        confidence: response.confidence || 85,
        timestamp: new Date().toISOString()
      };

      setInsights(prev => [newInsight, ...prev]);
      setQuery('');
    } catch (error) {
      setError('Failed to process AI query. Please try again.');
      console.error('Error processing query:', error);
    } finally {
      setLoading(false);
    }
  };

  const sampleQueries = [
    "Which regions have the highest volunteer retention rates?",
    "What factors predict successful volunteer conversion?",
    "Where should we focus recruitment efforts for maximum impact?",
    "How do disaster events affect volunteer application patterns?",
    "What's the optimal application processing time for conversion?",
    "Which demographics are underrepresented in our volunteer base?",
    "How can we improve volunteer engagement and retention?",
    "What are the key bottlenecks in our application pipeline?"
  ];

  const getInsightIcon = (index) => {
    const icons = [<Lightbulb />, <TrendingUp />, <Assessment />, <Psychology />];
    return icons[index % icons.length];
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        AI-Powered Insights
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Ask questions about your data and get intelligent insights powered by advanced AI analysis.
      </Typography>

      {/* Query Interface */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Ask a Question
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Ask a question about your volunteer data, trends, or insights..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleQuerySubmit()}
              disabled={loading}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="contained"
              onClick={handleQuerySubmit}
              disabled={loading || !query.trim()}
              startIcon={loading ? <CircularProgress size={16} /> : <Send />}
            >
              {loading ? 'Analyzing...' : 'Get AI Insights'}
            </Button>

            {metrics && (
              <Stack direction="row" spacing={1}>
                <Chip label={`${metrics.totalVolunteers?.toLocaleString()} Volunteers`} size="small" color="primary" variant="outlined" />
                <Chip label={`${metrics.totalApplicants?.toLocaleString()} Applications`} size="small" color="secondary" variant="outlined" />
                <Chip label={`${metrics.conversionRate}% Conversion`} size="small" color="success" variant="outlined" />
              </Stack>
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Sample Questions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Sample Questions
          </Typography>
          <Grid container spacing={1}>
            {sampleQueries.map((sampleQuery, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setQuery(sampleQuery)}
                  sx={{ 
                    textAlign: 'left', 
                    justifyContent: 'flex-start',
                    height: 'auto',
                    p: 1,
                    whiteSpace: 'normal'
                  }}
                >
                  {sampleQuery}
                </Button>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* AI Insights Results */}
      {insights.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            AI Analysis Results
          </Typography>
          
          <Stack spacing={3}>
            {insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="outlined" sx={{ 
                  borderLeft: '4px solid',
                  borderLeftColor: 'primary.main',
                  '&:hover': {
                    boxShadow: 2
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                      <AutoAwesome sx={{ color: 'primary.main', mt: 0.5 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                          {insight.query}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(insight.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                      <Chip 
                        label={`${insight.confidence}% confidence`} 
                        size="small" 
                        color="success"
                        variant="outlined"
                      />
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    {insight.insights && insight.insights.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
                          <Lightbulb sx={{ mr: 1, fontSize: 20 }} />
                          Key Insights
                        </Typography>
                        {insight.insights.map((insightText, i) => (
                          <Typography key={i} variant="body2" sx={{ mb: 1, pl: 3 }}>
                            • {insightText}
                          </Typography>
                        ))}
                      </Box>
                    )}
                    
                    {insight.recommendations && insight.recommendations.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
                          <TrendingUp sx={{ mr: 1, fontSize: 20 }} />
                          Recommendations
                        </Typography>
                        {insight.recommendations.map((rec, i) => (
                          <Typography key={i} variant="body2" sx={{ mb: 1, pl: 3, fontStyle: 'italic' }}>
                            → {rec}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Stack>
        </Box>
      )}

      {/* No insights yet */}
      {insights.length === 0 && !loading && (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Psychology sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Ready for AI Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ask a question above to get intelligent insights about your volunteer data
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AIInsights;