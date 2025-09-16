import React, { useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';
import { Box, Typography, Paper } from '@mui/material';

const DataChart = ({ 
  data, 
  type = 'bar', 
  title, 
  height = 400,
  layout = {},
  config = {}
}) => {
  const plotRef = useRef();

  const getDefaultLayout = () => ({
    title: {
      text: title,
      font: { family: 'Georgia, serif', size: 16, color: '#1B365D' }
    },
    font: { family: 'Georgia, serif', size: 12, color: '#1B365D' },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    margin: { l: 50, r: 50, t: 50, b: 50 },
    showlegend: true,
    legend: {
      orientation: 'h',
      y: -0.2,
      x: 0.5,
      xanchor: 'center'
    },
    ...layout
  });

  const getDefaultConfig = () => ({
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
    responsive: true,
    ...config
  });

  const processData = () => {
    if (!data) return [];

    switch (type) {
      case 'bar':
        return [{
          x: Object.keys(data),
          y: Object.values(data),
          type: 'bar',
          marker: {
            color: '#DC143C',
            line: { color: '#B71C1C', width: 1 }
          },
          text: Object.values(data),
          textposition: 'auto',
          hovertemplate: '<b>%{x}</b><br>Count: %{y}<extra></extra>'
        }];

      case 'pie':
        return [{
          values: Object.values(data),
          labels: Object.keys(data),
          type: 'pie',
          marker: {
            colors: ['#DC143C', '#1B365D', '#F7F7F7', '#666', '#999']
          },
          textinfo: 'label+percent',
          textposition: 'outside',
          hovertemplate: '<b>%{label}</b><br>Count: %{value}<br>Percentage: %{percent}<extra></extra>'
        }];

      case 'line':
        const sortedData = Object.entries(data).sort(([a], [b]) => a.localeCompare(b));
        return [{
          x: sortedData.map(([key]) => key),
          y: sortedData.map(([, value]) => value),
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#DC143C', width: 3 },
          marker: { color: '#DC143C', size: 8 },
          hovertemplate: '<b>%{x}</b><br>Count: %{y}<extra></extra>'
        }];

      case 'funnel':
        return [{
          type: 'funnel',
          y: Object.keys(data),
          x: Object.values(data),
          marker: {
            color: ['#DC143C', '#B71C1C', '#8B0000', '#660000'],
            line: { color: 'white', width: 2 }
          },
          textinfo: 'value+percent initial',
          hovertemplate: '<b>%{y}</b><br>Count: %{x}<extra></extra>'
        }];

      default:
        return [];
    }
  };

  const processedData = processData();
  const layoutConfig = getDefaultLayout();
  const configOptions = getDefaultConfig();

  return (
    <Paper sx={{ p: 2, height: height + 100 }}>
      <Box sx={{ height: height }}>
        <Plot
          ref={plotRef}
          data={processedData}
          layout={layoutConfig}
          config={configOptions}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler={true}
        />
      </Box>
    </Paper>
  );
};

export default DataChart;
