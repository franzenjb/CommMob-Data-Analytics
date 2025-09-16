import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './fix-backdrop.css';

import redCrossTheme from './theme/redCrossTheme';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './pages/Dashboard';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import Maps from './pages/Maps';
import Analytics from './pages/Analytics';
import Volunteers from './pages/Volunteers';
import Applicants from './pages/Applicants';
import Donors from './pages/Donors';
import BloodDrives from './pages/BloodDrives';
import AIInsights from './pages/AIInsights';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider theme={redCrossTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <Header onMenuClick={handleMenuClick} />
          <Sidebar open={sidebarOpen} />
          
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              mt: 8, // Height of AppBar
              ml: sidebarOpen ? '280px' : 0,
              transition: 'margin-left 0.2s ease-in-out',
              minHeight: 'calc(100vh - 64px)',
              backgroundColor: 'background.default'
            }}
          >
            <Routes>
              <Route path="/" element={<ExecutiveDashboard />} />
              <Route path="/executive" element={<ExecutiveDashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/maps" element={<Maps />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/volunteers" element={<Volunteers />} />
              <Route path="/applicants" element={<Applicants />} />
              <Route path="/donors" element={<Donors />} />
              <Route path="/blood-drives" element={<BloodDrives />} />
              <Route path="/ai-insights" element={<AIInsights />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
