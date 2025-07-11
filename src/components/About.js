import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Avatar, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  AppBar, 
  Toolbar,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { 
  GitHub, 
  Home, 
  Dashboard,
  TrendingUp,
  People,
  Analytics,
  Public,
  School,
  HealthAndSafety,
  Engineering,
  Psychology,
  CheckCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Fade } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Header from './Header';
import MenuIcon from '@mui/icons-material/Menu';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: theme.spacing(8, 0),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3,
  }
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  borderRadius: '16px',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(255,255,255,0.2)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  }
}));

const menuItems = [
  { text: 'Home', path: '/' },
  { text: 'About', path: '/about' },
  { text: 'Dashboard', path: '/dashboard' },
  { text: 'Sign In', path: '/signin' },
];

const About = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [menuOpen, setMenuOpen] = React.useState(false);
  const trigger = useScrollTrigger({ threshold: 10 });

  // Dropdown state
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [aboutSection, setAboutSection] = React.useState('pfom');
  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = (section) => {
    setAnchorEl(null);
    if (section) setAboutSection(section);
  };

  const features = [
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: '#667eea' }} />,
      title: 'Population Forecasting',
      description: 'Advanced algorithms to predict demographic trends and population growth patterns.'
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: '#667eea' }} />,
      title: 'Data Analytics',
      description: 'Comprehensive data analysis with interactive charts and visualizations.'
    },
    {
      icon: <People sx={{ fontSize: 40, color: '#667eea' }} />,
      title: 'Demographic Insights',
      description: 'Deep insights into age distribution, regional patterns, and population dynamics.'
    },
    {
      icon: <Public sx={{ fontSize: 40, color: '#667eea' }} />,
      title: 'Regional Analysis',
      description: 'Geographic distribution analysis across different regions of Malawi.'
    }
  ];

  const impactAreas = [
    { icon: <HealthAndSafety />, title: 'Healthcare Planning', description: 'Optimize healthcare resource allocation based on population projections.' },
    { icon: <School />, title: 'Education Planning', description: 'Plan educational infrastructure and resources for future generations.' },
    { icon: <Engineering />, title: 'Infrastructure Development', description: 'Design infrastructure projects to meet future population needs.' },
    { icon: <Psychology />, title: 'Social Services', description: 'Develop social programs tailored to demographic changes.' }
  ];

  const aboutFeatures = [
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: '#667eea' }} />,
      title: 'Population Forecasting',
      description: 'Advanced algorithms to predict demographic trends and population growth patterns.'
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: '#667eea' }} />,
      title: 'Data Analytics',
      description: 'Comprehensive data analysis with interactive charts and visualizations.'
    },
    {
      icon: <People sx={{ fontSize: 40, color: '#667eea' }} />,
      title: 'Demographic Insights',
      description: 'Deep insights into age distribution, regional patterns, and population dynamics.'
    },
    {
      icon: <Public sx={{ fontSize: 40, color: '#667eea' }} />,
      title: 'Regional Analysis',
      description: 'Geographic distribution analysis across different regions of Malawi.'
    }
  ];

  const dataSources = [
    'United Nations Population Fund (UNFPA)',
    'World Bank',
    'Malawi National Statistics Office (MASO)',
    'Population Reference Bureau (PRB)'
  ];

  const handleDrawerOpen = () => setMenuOpen(true);
  const handleDrawerClose = () => setMenuOpen(false);
  const handleDrawerMenuClick = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Only show Header on desktop */}
      {!isMobile && <Header forceWhite />}
      {/* Mobile sticky bar */}
      {isMobile && (
        <>
          {/* Single fixed-position bar, content swaps based on scroll */}
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: 56,
              bgcolor: 'rgba(24,28,36,0.98)',
              zIndex: 1200,
              boxShadow: 1,
              px: 2,
              py: 1.2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'background 0.2s',
            }}
          >
            {trigger ? (
              <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#fff', fontSize: '1rem', letterSpacing: 0.5 }}>
                PFOM
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  sx={{ color: '#fff', letterSpacing: 0.5, fontSize: '0.98rem', lineHeight: 1.1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  Population Forecast
                </Typography>
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  sx={{ color: '#fff', letterSpacing: 0.5, fontSize: '0.98rem', lineHeight: 1.1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  of Malawi
                </Typography>
              </Box>
            )}
            <IconButton aria-label="menu" onClick={handleDrawerOpen} sx={{ color: '#fff', background: 'rgba(0,0,0,0.10)' }}>
              <MenuIcon fontSize="large" />
            </IconButton>
          </Box>
          {/* Drawer for navigation */}
          <Drawer
            anchor="right"
            open={menuOpen}
            onClose={handleDrawerClose}
            PaperProps={{ sx: { width: 220, pt: 2 } }}
          >
            <Typography variant="h6" textAlign="center" fontWeight={700} sx={{ color: theme.palette.success.main, mb: 1 }}>
              Menu
            </Typography>
            <Divider />
            <List>
              {menuItems.map((item) => (
                <ListItem button key={item.text} onClick={() => handleDrawerMenuClick(item.path)}>
                  <ListItemText primary={item.text} primaryTypographyProps={{ textAlign: 'center', fontWeight: 500 }} />
                </ListItem>
              ))}
            </List>
          </Drawer>
        </>
      )}
      <Box
        sx={{
          minHeight: '100vh',
          background: '#f5f7fa',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: { xs: 2, sm: 6 },
          mt: { xs: 0, sm: 10 },
          pt: { xs: '75px', sm: 0 },
          '@media (max-width:600px)': {
            fontSize: '0.85rem',
            width: '100%',
            maxWidth: '100%',
          },
        }}
      >
        {/* Header/Navbar remains at the top (handled by layout) */}
        <Box sx={{ width: '100%', maxWidth: 1200, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h4" fontWeight={800} sx={{ color: '#222' }}>
            About
        </Typography>
          <Button
            variant="outlined"
            endIcon={<ArrowDropDownIcon />}
            onClick={handleMenuClick}
            sx={{ borderColor: '#257a5a', color: '#257a5a', fontWeight: 600 }}
          >
            {aboutSection === 'pfom' ? 'About PFOM' : 'About Developer'}
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={() => handleMenuClose()}>
            <MenuItem onClick={() => handleMenuClose('pfom')}>About PFOM</MenuItem>
            <MenuItem onClick={() => handleMenuClose('developer')}>About Developer</MenuItem>
          </Menu>
        </Box>
      <Box
        sx={{
            width: '100%',
            maxWidth: 1200,
            background: '#fff',
            borderRadius: 3,
            boxShadow: '0 4px 24px 0 rgba(33,150,243,0.10)',
            borderLeft: '8px solid #257a5a',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            p: { xs: 2, sm: 4 },
            gap: 4,
          }}
        >
          {aboutSection === 'pfom' ? (
            <>
              {/* Left: Text Content */}
              <Box flex={2}>
                <Typography variant="h4" fontWeight={800} sx={{ color: '#222', mb: 1 }}>
                  Population Forecast of Malawi (PFOM)
                </Typography>
                <Divider sx={{ width: 60, borderBottomWidth: 3, borderColor: '#257a5a', mb: 2 }} />
                <Typography variant="body1" sx={{ color: '#333', mb: 2 }}>
                  The <b>Population Forecast of Malawi (PFOM)</b> is a modern web application designed to provide accurate, up-to-date demographic forecasts and insights for Malawi. PFOM leverages advanced analytics and official data sources to support decision-making for government, researchers, and the public.<br/><br/>
                  PFOM is inspired by the National Statistical Office (NSO) and customizes its approach for digital accessibility, interactive visualizations, and user-friendly access to population data and projections.
            </Typography>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#222', mt: 3, mb: 1 }}>
                  Data Sources & Methodology
            </Typography>
                <Typography variant="body1" sx={{ color: '#333', mb: 1 }}>
                  PFOM uses data from the NSO, United Nations, World Bank, and other reputable sources. Forecasts are generated using statistical models and regularly updated to reflect the latest trends and census results.
              </Typography>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#222', mt: 3, mb: 1 }}>
                  Key Features
              </Typography>
                <ul style={{ color: '#333', marginLeft: 18 }}>
                  <li>Population projections by year, region, and demographic group</li>
                  <li>Interactive charts and downloadable datasets</li>
                  <li>Insights for policy, planning, and research</li>
                </ul>
                    </Box>
              {/* Right: PFOM/NSO Official Info (use NSO image for now) */}
              <Box flex={1} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 260 }}>
                <Box
                  component="img"
                  src="/images/profile.jpg"
                  alt="Samuel D. Kachali"
                  sx={{ width: 240, height: 300, objectFit: 'cover', borderRadius: 2, mb: 2, boxShadow: 2 }}
                />
                <Typography variant="h6" fontWeight={700} sx={{ color: '#222', textAlign: 'center', mb: 0.5 }}>
                  Samuel D. Kachali
                    </Typography>
                <Typography variant="subtitle2" sx={{ color: '#666', textAlign: 'center' }}>
                  Commissioner of Statistics
                    </Typography>
              </Box>
            </>
          ) : (
            <>
              {/* Left: Developer Bio */}
              <Box flex={2}>
                <Typography variant="h4" fontWeight={800} sx={{ color: '#222', mb: 1 }}>
                  About the Developer
              </Typography>
                <Divider sx={{ width: 60, borderBottomWidth: 3, borderColor: '#257a5a', mb: 2 }} />
                <Typography variant="body1" sx={{ color: '#333', mb: 2 }}>
                  <b>Samuel D. Kachali</b> is the developer of the Population Forecast of Malawi (PFOM) app. Passionate about data science, software engineering, and digital transformation for Africa, Samuel built PFOM to make population data more accessible and actionable for all Malawians.<br/><br/>
                  Samuel is experienced in web development, data analytics, and building user-friendly digital tools. He is committed to using technology for social good and national development.
                      </Typography>
                    </Box>
              {/* Right: Developer Photo */}
              <Box flex={1} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 260 }}>
                <Box
                  component="img"
                  src="/images/profile.jpg"
                  alt="Samuel D. Kachali"
                  sx={{ width: 240, height: 300, objectFit: 'cover', borderRadius: 2, mb: 2, boxShadow: 2 }}
                />
                <Typography variant="h6" fontWeight={700} sx={{ color: '#222', textAlign: 'center', mb: 0.5 }}>
                  Samuel D. Kachali
              </Typography>
                <Typography variant="subtitle2" sx={{ color: '#666', textAlign: 'center' }}>
                  Developer
              </Typography>
              </Box>
            </>
          )}
          </Box>
      </Box>
    </>
  );
};

export default About; 