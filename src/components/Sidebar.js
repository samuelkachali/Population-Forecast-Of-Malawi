import React, { useEffect, useState, useContext } from 'react';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, useTheme,
  useMediaQuery, Typography, InputBase, Divider, Switch
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Dashboard, Timeline, History, Assessment, Map, Groups,
  TrendingUp, School, HealthAndSafety, Business, Compare, Settings,
  DataUsage, BarChart, People, Logout, Search, ShoppingBag
} from '@mui/icons-material';
import { useUser } from '../contexts/UserContext';
import { clearForecastData } from '../contexts/ForecastContext';
import { useForecast } from '../contexts/ForecastContext';

const drawerWidth = 300;

const menuItems = [
  { 
    header: 'HOME',
    items: [
      { text: 'Home', icon: <Home />, path: '/' },
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    ],
  },
  {
    header: 'Population Analysis',
    items: [
      { text: 'Population Overview', icon: <People />, path: '/dashboard/overview' },
      { text: 'Forecasting', icon: <Timeline />, path: '/dashboard/forecast' },
      { text: 'Historical Trends', icon: <History />, path: '/dashboard/history' },
      { text: 'Growth Analysis', icon: <TrendingUp />, path: '/dashboard/growth' },
      { text: 'Comparative Studies', icon: <Compare />, path: '/dashboard/compare' },
    ],
  },
  {
    header: 'Demographics',
    items: [
      { text: 'Age Distribution', icon: <BarChart />, path: '/dashboard/age-groups' },
      { text: 'Regional Data', icon: <Map />, path: '/dashboard/regions' },
      { text: 'Urban vs Rural', icon: <Business />, path: '/dashboard/urban-rural' },
      { text: 'Education Stats', icon: <School />, path: '/dashboard/education' },
      { text: 'Health Metrics', icon: <HealthAndSafety />, path: '/dashboard/health' },
    ],
  },
  {
    header: 'Reports & Insights',
    items: [
      { text: 'Analytics', icon: <DataUsage />, path: '/dashboard/analytics' },
      { text: 'Reports', icon: <Assessment />, path: '/dashboard/reports' },
      { text: 'Demographics', icon: <Groups />, path: '/dashboard/demographics' },
    ],
  },
];

const systemItems = [
  { text: 'User Management', icon: <People />, path: '/dashboard/user-management' },
  { text: 'Settings', icon: <Settings />, path: '/dashboard/settings' },
  { text: 'Logout', icon: <Logout />, path: '/logout', isLogout: true },
];

const Sidebar = ({ open, onToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const { setUser, user } = useUser();
  const { setRegressors, setPredictions, setRegressorsChartImage, setPopulationChartImage } = useForecast();

  const renderMenu = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pt: 5, backgroundColor: '#fff', fontFamily: '"Poppins", "Montserrat", "Inter", Arial, sans-serif' }}>
      <Box>
        <List sx={{ px: 1.5 }}>
          {menuItems.map((section) => (
            <Box key={section.header} sx={{ mb: 2 }}>
        <Typography 
                variant="caption"
          sx={{ 
                  color: '#6c757d',
            fontWeight: 700, 
                  textTransform: 'uppercase',
                  pl: 1,
                  mb: 0.5,
                  display: 'block',
                  fontFamily: 'inherit',
                  letterSpacing: 1.5,
                }}
              >
                {section.header}
              </Typography>
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                <ListItemButton
                    key={item.text}
                    onClick={() => navigate(item.path)}
                  sx={{
                      borderRadius: 8,
                      mb: 0.5,
                      backgroundColor: isActive ? '#257a5a' : 'transparent',
                      color: isActive ? '#fff' : '#222',
                      fontWeight: isActive ? 700 : 500,
                      px: 2.5, py: 1.1,
                      '&:hover': { backgroundColor: isActive ? '#257a5a' : '#f0f0f0' },
                    }}
                >
                    <ListItemIcon sx={{ color: isActive ? '#fff' : '#257a5a', minWidth: 36 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                      primaryTypographyProps={{
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '1rem',
                        fontFamily: 'inherit',
                        letterSpacing: 0.2,
                    }}
                  />
                </ListItemButton>
                );
              })}
            </Box>
        ))}
      </List>
      </Box>

      <Box sx={{ px: 2, pb: 2 }}>
        <Divider sx={{ mb: 1.5, borderColor: '#e0e0e0' }} />
        {systemItems.map((item) => {
          if (item.text === 'User Management' && (!user || user.role !== 'admin')) return null;
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.text}
              onClick={() => {
                if (item.isLogout) {
                  localStorage.removeItem('user');
                  localStorage.removeItem('token');
                  clearForecastData();
                  setRegressors(null);
                  setPredictions(null);
                  setRegressorsChartImage(null);
                  setPopulationChartImage(null);
                  setUser(null);
                  navigate('/signin');
                } else navigate(item.path);
              }}
              sx={{
                borderRadius: 8,
                mb: 0.5,
                backgroundColor: isActive ? '#257a5a' : 'transparent',
                color: isActive ? '#fff' : '#222',
                fontWeight: isActive ? 700 : 500,
                px: 2.5, py: 1.1,
                '&:hover': { backgroundColor: isActive ? '#257a5a' : '#f0f0f0' },
              }}
            >
              <ListItemIcon sx={{ color: isActive ? '#fff' : '#257a5a', minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  letterSpacing: 0.2,
                }}
              />
            </ListItemButton>
          );
        })}

        <Box
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            background: '#f6f7f9',
            borderRadius: 8,
            px: 1.5,
            py: 0.7,
            mt: 1.5,
          }}
        >
          <Typography variant="body2" sx={{ flex: 1, color: '#6c757d', fontFamily: 'inherit' }}>Dark Mode</Typography>
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode((prev) => !prev)}
            color="success"
          />
        </Box>
      </Box>
    </Box>
  );

  return (
        <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
          open={open}
          onClose={onToggle}
      ModalProps={{ keepMounted: true }}
          sx={{
        display: { xs: 'block', md: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
          backgroundColor: '#fff',
              boxSizing: 'border-box',
          overflowX: 'hidden',
          borderRight: '1px solid #e0e0e0',
            },
          }}
        >
      {renderMenu()}
        </Drawer>
  );
};

export default Sidebar; 