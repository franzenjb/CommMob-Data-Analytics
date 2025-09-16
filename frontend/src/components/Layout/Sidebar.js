import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography
} from '@mui/material';
import {
  Dashboard,
  BusinessCenter,
  Map,
  BarChart,
  People,
  Assignment,
  Analytics,
  AttachMoney,
  LocalHospital,
  Settings,
  Help
} from '@mui/icons-material';

const drawerWidth = 280;

const menuItems = [
  { text: 'Executive Command', icon: <BusinessCenter />, path: '/', featured: true },
  { text: 'Operations Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Interactive Maps', icon: <Map />, path: '/maps' },
  { text: 'Analytics', icon: <BarChart />, path: '/analytics' },
  { text: 'Volunteers', icon: <People />, path: '/volunteers' },
  { text: 'Applicants', icon: <Assignment />, path: '/applicants' },
  { text: 'Donors', icon: <AttachMoney />, path: '/donors' },
  { text: 'Blood Drives', icon: <LocalHospital />, path: '/blood-drives' },
  { text: 'AI Insights', icon: <Analytics />, path: '/ai-insights' },
];

const bottomMenuItems = [
  { text: 'Settings', icon: <Settings />, path: '/settings' },
  { text: 'Help', icon: <Help />, path: '/help' },
];

const Sidebar = ({ open, onClose }) => {
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: 64, // Height of AppBar
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Navigation
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Data Analytics Platform
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              sx={{
                backgroundColor: item.featured ? 'primary.main' : 'transparent',
                color: item.featured ? 'white' : 'inherit',
                '&:hover': {
                  backgroundColor: item.featured ? 'primary.dark' : 'action.hover',
                },
                borderRadius: item.featured ? 1 : 0,
                mx: item.featured ? 1 : 0,
                my: item.featured ? 0.5 : 0
              }}
            >
              <ListItemIcon sx={{ 
                color: item.featured ? 'white' : 'primary.main' 
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: item.featured ? 600 : 500
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ mt: 'auto' }} />
      
      <List>
        {bottomMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton>
              <ListItemIcon sx={{ color: 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.9rem'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
