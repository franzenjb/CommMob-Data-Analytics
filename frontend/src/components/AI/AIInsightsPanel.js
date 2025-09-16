import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Chip,
  Stack,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  IconButton,
  Collapse
} from '@mui/material';
import {
  Send,
  Lightbulb,
  TrendingUp,
  Assessment,
  Refresh,
  ExpandMore,
  ExpandLess,
  Psychology,
  AutoAwesome
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import cloudflareAI from '../../services/cloudflareAI';

const AIInsightsPanel = ({ metrics, onInsightsGenerated }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const sampleQueries = [
    "Which regions have the highest volunteer retention?",
    "What factors predict successful volunteer conversion?",
    "Where should we focus recruitment efforts?",
    "How do disaster events affect volunteer applications?",
    "What's the optimal application processing time?",
    "Which demographics are underrepresented?"
  ];

  useEffect(() => {
    if (metrics && Object.keys(metrics).length > 0) {
      generateDashboardInsights();
    }
  }, [metrics]);

  const generateDashboardInsights = async () => {
    try {
      setLoading(true);
      const aiInsights = await cloudflareAI.generateDashboardInsights(metrics);
      
      // Create insight object for display
      const insightObject = {
        id: Date.now(),
        query: 'Dashboard Analysis',
        insights: aiInsights.insights || [],
        recommendations: aiInsights.recommendations || [],
        confidence: aiInsights.confidence || 85,
        timestamp: new Date().toISOString(),
        isDemo: aiInsights.isDemo || false
      };
      
      setInsights([insightObject]);
      onInsightsGenerated?.(aiInsights);
    } catch (error) {
      console.error('Error generating AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuerySubmit = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const response = await cloudflareAI.processNaturalLanguageQuery(query, metrics);
      
      const newInsight = {
        id: Date.now(),
        query: query,
        insights: response.insights,
        recommendations: response.recommendations,
        confidence: response.confidence,
        timestamp: new Date().toISOString()
      };

      setInsights(prev => [newInsight, ...prev]);
      setQuery('');
    } catch (error) {
      console.error('Error processing query:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleQuery = (sampleQuery) => {
    setQuery(sampleQuery);
  };

  const getInsightIcon = (index) => {
    const icons = [<Lightbulb />, <TrendingUp />, <Assessment />, <Psychology />];
    return icons[index % icons.length];
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AutoAwesome sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
            AI-Powered Insights
          </Typography>
          {insights.length > 0 && insights[0]?.isDemo && (
            <Chip 
              label="Demo Mode" 
              size="small" 
              color="warning" 
              variant="outlined"
              sx={{ mr: 1 }}
            />
          )}
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        <Collapse in={expanded}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ask questions about your data and get intelligent insights powered by Cloudflare AI
            </Typography>
            
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Ask a question about your data..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleQuerySubmit()}
                disabled={loading}
                size="small"
              />
              <Button
                variant="contained"
                onClick={handleQuerySubmit}
                disabled={loading || !query.trim()}
                startIcon={loading ? <CircularProgress size={16} /> : <Send />}
              >
                Analyze
              </Button>
            </Stack>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Sample questions:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {sampleQueries.map((sampleQuery, index) => (
                  <Chip
                    key={index}
                    label={sampleQuery}
                    size="small"
                    onClick={() => handleSampleQuery(sampleQuery)}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
        </Collapse>

        <AnimatePresence>
          {insights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Generated Insights
              </Typography>
              
              <Stack spacing={2}>
                {insights.map((insight, index) => (
                  <motion.div
                    key={insight.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card variant="outlined" sx={{ 
                      borderLeft: '4px solid',
                      borderLeftColor: 'primary.main',
                      '&:hover': {
                        boxShadow: 2
                      }
                    }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                          {getInsightIcon(index)}
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, flexGrow: 1 }}>
                            {insight.query || 'Dashboard Insights'}
                          </Typography>
                          <Chip 
                            label={`${insight.confidence || 85}%`} 
                            size="small" 
                            color="success"
                            variant="outlined"
                          />
                        </Box>
                        
                        {insight.insights && (
                          <Box sx={{ mb: 1 }}>
                            {insight.insights.map((insightText, i) => (
                              <Typography key={i} variant="body2" sx={{ mb: 0.5 }}>
                                • {insightText}
                              </Typography>
                            ))}
                          </Box>
                        )}
                        
                        {insight.recommendations && (
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Recommendations:
                            </Typography>
                            {insight.recommendations.map((rec, i) => (
                              <Typography key={i} variant="body2" sx={{ mb: 0.5, fontStyle: 'italic' }}>
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
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} sx={{ mr: 2 }} />
            <Typography variant="body2" color="text.secondary">
              AI is analyzing your data...
            </Typography>
          </Box>
        )}
      </Paper>
    </motion.div>
  );
};

export default AIInsightsPanel;
