// Move all imports to the top
import React, { useState, useEffect, useRef } from 'react';
import Popover from '@mui/material/Popover';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import UserManagement from './UserManagement';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import TimelineIcon from '@mui/icons-material/Timeline';
import Forecast from './Forecast';
import PopulationOverview from './PopulationOverview';
import HistoricalTrend from './HistoricalTrend';
import GrowthAnalysis from './GrowthAnalysis';
import ComparativeStudies from './ComparativeStudies';
import AgeDistribution from './AgeDistribution';
import RegionalData from './RegionalData';
import UrbanRural from './UrbanRural';
import EducationStats from './EducationStats';
import HealthMetrics from './HealthMetrics';
import Analytics from './Analytics';
import Reports from './Reports';
import Demographics from './Demographics';
import Settings from './Settings';
import { useUser } from '../contexts/UserContext';
import { useGrowth } from '../contexts/GrowthContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const drawerWidth = 300;

const DashboardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  overflowX: 'hidden',
  backgroundColor: '#f5f7fa',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: '#fff',
  borderRadius: '16px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  transition: 'box-shadow 0.2s, transform 0.2s',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    transform: 'translateY(-4px)',
  },
}));

const StatCard = styled(Card)(({ theme }) => ({
  background: '#fff',
  borderRadius: '20px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  transition: 'box-shadow 0.3s, transform 0.3s',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    transform: 'translateY(-4px)',
  },
}));

const StatIcon = styled(Box)(({ theme, color }) => ({
  width: '64px',
  height: '64px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '16px',
  background: color,
  color: '#fff',
  fontSize: '2rem',
  marginRight: theme.spacing(2),
}));

const ChartContainer = styled(Box)({
  height: '350px',
  position: 'relative',
});

// Use environment variable for API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://population-forecast-of-malawi.onrender.com";

const DashboardOverview = ({ dashboardData, loading, error, setRefreshKey }) => {
  const ICONS = {
    PeopleIcon: <PeopleIcon />,
    TimelineIcon: <TimelineIcon />,
    TrendingUpIcon: <TrendingUpIcon />,
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
  };

  // Use real stats from backend
  const statsArray = dashboardData && dashboardData.stats
    ? Object.values(dashboardData.stats)
    : [];
  console.log('DashboardOverview statsArray:', statsArray);

  if (loading) return <CircularProgress />;
  if (error)
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="error" gutterBottom>
          Error: {error}
        </Typography>
        <Box mt={2}>
          <Button variant="contained" onClick={() => setRefreshKey((prev) => prev + 1)}>
            Refresh
          </Button>
        </Box>
      </Box>
    );

  if (!dashboardData) return <Typography>No data available.</Typography>;

  // Only keep the three stat cards
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', py: 4 }}>
      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        {Array.isArray(statsArray) && statsArray.length > 0 ? (
          statsArray.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
              <StatCard sx={{ mb: 4, minHeight: 160, width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                  <StatIcon color={stat.color}>{ICONS[stat.icon]}</StatIcon>
                  <Box>
                    <Typography variant="subtitle1" color="textSecondary">
                      {stat.label}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={stat.change.startsWith('+') ? 'success.main' : 'error.main'}
                    >
                      {stat.change}
                    </Typography>
                    {stat.year && (
                      <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                        Year: {stat.year}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </StatCard>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography color="textSecondary" align="center">No stats data available.</Typography>
          </Grid>
        )}
      </Grid>
      {/* Welcome message instead of charts */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 220 }}>
        <Paper elevation={2} sx={{ borderRadius: 4, p: { xs: 3, md: 5 }, maxWidth: 600, width: '100%', textAlign: 'center', background: 'linear-gradient(120deg, #f5f7fa 0%, #e3eafc 100%)' }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2, color: 'primary.main' }}>
            Welcome to your dashboard!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore the latest population insights and forecasts for Malawi. Use the sidebar to navigate to detailed analytics, reports, and more.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser(); // get current user
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { setGrowthData } = useGrowth();
  // Custom Tour State
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const sidebarRef = useRef();
  const forecastRef = useRef();
  const predictPopRef = useRef();
  const reportsRef = useRef();
  const settingsRef = useRef();
  const tourSteps = [
    {
      ref: sidebarRef,
      content: 'Navigate between dashboard features here.'
    },
    {
      ref: forecastRef,
      content: 'Set your years and click here to predict regressors.'
    },
    {
      ref: predictPopRef,
      content: 'After regressors, click here to predict population.'
    },
    {
      ref: reportsRef,
      content: 'Download your generated reports here.'
    },
    {
      ref: settingsRef,
      content: 'Update your profile and preferences here.'
    }
  ];
  const navigate = useNavigate();
  useEffect(() => {
    if (user && localStorage.getItem(`tutorialCompleted_${user.email}`) !== 'true') {
      setTourOpen(true);
    }
  }, [user]);

  // Auto-navigate to the correct page for each tour step
  useEffect(() => {
    if (!tourOpen) return;
    if (tourStep === 0) navigate('/dashboard'); // Sidebar
    if (tourStep === 1 || tourStep === 2) navigate('/dashboard/forecast'); // Forecast buttons
    if (tourStep === 3) navigate('/dashboard/reports'); // Reports
    if (tourStep === 4) navigate('/dashboard/settings'); // Settings
  }, [tourStep, tourOpen, navigate]);
  const handleTourNext = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      setTourOpen(false);
      if (user) localStorage.setItem(`tutorialCompleted_${user.email}`, 'true');
    }
  };
  const handleTourBack = () => {
    if (tourStep > 0) setTourStep(tourStep - 1);
  };
  const handleTourClose = () => {
    setTourOpen(false);
    if (user) localStorage.setItem(`tutorialCompleted_${user.email}`, 'true');
  };

  const retryFetch = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      try {
        const [statsRes, trendRes, ageRes, regionalRes, demographicsRes, healthRes, growthRes, analyticsRes, urbanRuralRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/dashboard/stats`, { headers }),
          fetch(`${API_BASE_URL}/api/dashboard/population-trend`, { headers }),
          fetch(`${API_BASE_URL}/api/dashboard/age-distribution`, { headers }),
          fetch(`${API_BASE_URL}/api/dashboard/regional-distribution`, { headers }),
          fetch(`${API_BASE_URL}/api/dashboard/demographics`, { headers }),
          fetch(`${API_BASE_URL}/api/dashboard/health-metrics`, { headers }),
          fetch(`${API_BASE_URL}/api/dashboard/growth-analysis`, { headers }),
          fetch(`${API_BASE_URL}/api/dashboard/analytics`, { headers }),
          fetch(`${API_BASE_URL}/api/dashboard/urban-rural`, { headers }),
        ]);

        if (!statsRes.ok || !trendRes.ok || !ageRes.ok || !regionalRes.ok || !demographicsRes.ok || !healthRes.ok || !growthRes.ok || !analyticsRes.ok || !urbanRuralRes.ok) {
          throw new Error('Failed to fetch all dashboard data.');
        }

        const stats = await statsRes.json();
        const populationTrend = await trendRes.json();
        const ageDistribution = await ageRes.json();
        const regionalDistribution = await regionalRes.json();
        const demographicsData = await demographicsRes.json();
        const healthData = await healthRes.json();
        const growthData = await growthRes.json();
        const analyticsData = await analyticsRes.json();
        const urbanRuralData = await urbanRuralRes.json();

        setDashboardData({ stats, populationTrend, ageDistribution, regionalDistribution, demographicsData, healthData, growthData, analyticsData, urbanRuralData });
        setGrowthData(growthData); // Ensure context is updated with real data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]);

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  if (error === 'Not authenticated') {
    return <Navigate to="/signin" replace />;
  }

  return (
    <DashboardContainer>
      <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} ref={sidebarRef} />
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          ml: { xs: 0, md: `${drawerWidth}px` },
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <DashboardHeader onToggleSidebar={handleSidebarToggle} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            pt: { xs: 7, md: 8 },
            pb: { xs: 2, md: 3 },
            px: { xs: 1, sm: 2, md: 3 },
            minHeight: '100vh',
          }}
        >
          {/* Custom Guided Tour Popover */}
          <Popover
            open={tourOpen}
            anchorEl={tourSteps[tourStep].ref.current}
            onClose={handleTourClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            PaperProps={{ sx: { p: 2, maxWidth: 320, borderRadius: 3, boxShadow: 6 } }}
            disableAutoFocus
            disableEnforceFocus
          >
            <div style={{ minHeight: 60, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{tourSteps[tourStep].content}</span>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <Button onClick={handleTourBack} disabled={tourStep === 0}>Back</Button>
                <Button onClick={handleTourNext} variant="contained" color="primary">
                  {tourStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                </Button>
                <Button onClick={handleTourClose} color="error">Skip</Button>
              </div>
            </div>
          </Popover>
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
              }}
            >
              <CircularProgress size={60} />
            </Box>
          ) : (
            <>
              <Routes>
                <Route
                  path=""
                  element={
                    <DashboardOverview
                      dashboardData={dashboardData}
                      loading={loading}
                      error={error}
                      setRefreshKey={setRefreshKey}
                    />
                  }
                />
                <Route path="overview" element={<PopulationOverview stats={dashboardData?.stats} />} />
                <Route path="forecast" element={<Forecast ref={forecastRef} predictPopRef={predictPopRef} />} />
                <Route path="history" element={<HistoricalTrend populationTrend={dashboardData?.populationTrend} />} />
                <Route path="growth" element={<GrowthAnalysis growthData={dashboardData?.growthData} />} />
                <Route path="compare" element={<ComparativeStudies />} />
                <Route path="age-groups" element={<AgeDistribution realAgeDistribution={dashboardData?.ageDistribution?.real} mockAgeDistribution={dashboardData?.ageDistribution?.mock} />} />
                <Route path="regions" element={<RegionalData regionalData={dashboardData?.regionalDistribution} />} />
                <Route path="urban-rural" element={<UrbanRural urbanRuralData={dashboardData?.urbanRuralData} />} />
                <Route path="education" element={<EducationStats />} />
                <Route path="health" element={<HealthMetrics healthData={dashboardData?.healthData} />} />
                <Route path="analytics" element={<Analytics analyticsData={dashboardData?.analyticsData} />} />
                <Route path="demographics" element={<Demographics demographicsData={dashboardData?.demographicsData} />} />
                <Route path="reports" element={<Reports ref={reportsRef} />} />
                <Route path="settings" element={<Settings ref={settingsRef} />} />
                <Route path="user-management" element={<UserManagement />} />
                <Route path="*" element={<Navigate to="overview" replace />} />
              </Routes>
            </>
          )}
        </Box>
      </Box>
    </DashboardContainer>
  );
};

export default Dashboard;