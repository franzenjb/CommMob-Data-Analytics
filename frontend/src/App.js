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
import ExecutiveMinimal from './pages/ExecutiveMinimal';
import WorldClassExecutiveDashboard from './pages/WorldClassExecutiveDashboard';
import NewWorldClassExecutiveDashboard from './components/Executive/WorldClassExecutiveDashboard';
import CompleteDashboard from './pages/CompleteDashboard';
import PowerfulExecutiveDashboard from './pages/PowerfulExecutiveDashboard';
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
        <Box sx={{ display: 'block' }}>
          <Box component="main" sx={{ p: 0, m: 0 }}>
            <Routes>
              <Route path="/" element={<NewWorldClassExecutiveDashboard />} />
              <Route path="/executive" element={<NewWorldClassExecutiveDashboard />} />
              <Route path="/executive-old" element={<PowerfulExecutiveDashboard />} />
              <Route path="/advanced" element={<WorldClassExecutiveDashboard />} />
              <Route path="/executive-minimal" element={<ExecutiveMinimal />} />
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
