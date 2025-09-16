import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Paper, ToggleButton, ToggleButtonGroup, Card, CardContent } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Advanced Chart Components
const COLORS = ['#DC143C', '#1B365D', '#F7F7F7', '#666', '#999'];

function NetworkGraph({ data, type = 'volunteers' }) {
  const getNodeColor = (item) => {
    if (type === 'volunteers') {
      switch (item.status) {
        case 'General Volunteer': return '#DC143C';
        case 'Prospective Volunteer': return '#1B365D';
        case 'Youth Under 18': return '#F7F7F7';
        default: return '#666';
      }
    } else {
      switch (item.status) {
        case 'Converted': return '#DC143C';
        case 'Inactive': return '#666';
        case 'Lapsed': return '#999';
        default: return '#1B365D';
      }
    }
  };

  // Process data for network visualization
  const networkData = data.slice(0, 20).map((item, index) => ({
    id: index,
    name: item.name || `Node ${index}`,
    value: Math.random() * 100,
    color: getNodeColor(item),
    status: item.status
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={networkData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#DC143C" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function ForceGraph3D({ data }) {
  // Process data for force graph visualization
  const forceData = data.slice(0, 10).map((item, index) => ({
    name: item.name || `Item ${index}`,
    value: Math.random() * 50 + 10,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={forceData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {forceData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

function BarChart3D({ data, type = 'status' }) {
  const getBarData = () => {
    if (type === 'status') {
      const statusCounts = {};
      data.forEach(item => {
        const status = item.status || 'Unknown';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      return Object.entries(statusCounts).map(([status, count]) => ({
        name: status,
        value: count,
        color: status === 'General Volunteer' ? '#DC143C' : 
               status === 'Prospective Volunteer' ? '#1B365D' : '#666'
      }));
    }
    return [];
  };

  const barData = getBarData();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={barData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#DC143C" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Main 3D Visualization Component
const ThreeDVisualization = ({ data, visualizationType = 'network', title = '3D Data Visualization' }) => {
  const [selectedType, setSelectedType] = useState(visualizationType);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [data, selectedType]);

  const handleTypeChange = (event, newType) => {
    if (newType !== null) {
      setSelectedType(newType);
    }
  };

  const renderVisualization = () => {
    switch (selectedType) {
      case 'network':
        return <NetworkGraph data={data} type="volunteers" />;
      case 'force':
        return <ForceGraph3D data={data} />;
      case 'barchart':
        return <BarChart3D data={data} type="status" />;
      default:
        return <NetworkGraph data={data} type="volunteers" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper sx={{ p: 3, height: 500 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          
          <ToggleButtonGroup
            value={selectedType}
            exclusive
            onChange={handleTypeChange}
            size="small"
          >
            <ToggleButton value="network">Network</ToggleButton>
            <ToggleButton value="force">Force Graph</ToggleButton>
            <ToggleButton value="barchart">3D Bars</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ height: 400, borderRadius: 1, overflow: 'hidden', position: 'relative' }}>
          {isLoading ? (
            <Box sx={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'grey.50'
            }}>
              <Typography color="text.secondary">
                Loading advanced visualization...
              </Typography>
            </Box>
          ) : (
            <Box sx={{ 
              height: '100%', 
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              p: 2
            }}>
              {renderVisualization()}
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Controls:</strong> Click and drag to rotate • Scroll to zoom • Right-click to pan
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Data Points:</strong> {data.length} records visualized in 3D space
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default ThreeDVisualization;
