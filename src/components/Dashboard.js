import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Routes, Route, Navigate } from 'react-router-dom';
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

  const { populationTrend, ageDistribution, regionalDistribution } = dashboardData;

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

      <Grid container spacing={4} justifyContent="center" alignItems="flex-start" mt={2}>
        <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'center' }}>
          <StyledCard sx={{ width: '100%', maxWidth: 700, mx: 'auto' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center">
                Population Trend
              </Typography>
              <ChartContainer>
                {populationTrend && typeof populationTrend === 'object' && Array.isArray(populationTrend.datasets) && populationTrend.datasets.length > 0 ? (
                  <Line data={populationTrend} options={chartOptions} />
                ) : (
                  <Typography color="textSecondary" align="center">No population trend data available.</Typography>
                )}
              </ChartContainer>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <StyledCard sx={{ width: '100%', maxWidth: 350, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center">
                Age Distribution
              </Typography>
              <ChartContainer sx={{ height: 240 }}>
                {ageDistribution && typeof ageDistribution === 'object' && Array.isArray(ageDistribution.datasets) && ageDistribution.datasets.length > 0 ? (
                  <Doughnut data={ageDistribution} options={{ ...chartOptions, cutout: '70%' }} />
                ) : (
                  <Typography color="textSecondary" align="center">No age distribution data available.</Typography>
                )}
              </ChartContainer>
            </CardContent>
          </StyledCard>

          <StyledCard sx={{ width: '100%', maxWidth: 350 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center">
                Regional Population
              </Typography>
              <ChartContainer sx={{ height: 240 }}>
                {regionalDistribution && typeof regionalDistribution === 'object' && Array.isArray(regionalDistribution.datasets) && regionalDistribution.datasets.length > 0 ? (
                  <Bar
                    data={regionalDistribution}
                    options={{ ...chartOptions, indexAxis: 'y' }}
                  />
                ) : (
                  <Typography color="textSecondary" align="center">No regional distribution data available.</Typography>
                )}
              </ChartContainer>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { setGrowthData } = useGrowth();

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
      <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />
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
          ) : error ? (
            <Box
              sx={{
                textAlign: 'center',
                py: { xs: 4, md: 8 },
                px: { xs: 2, md: 4 },
              }}
            >
              <Typography
                variant="h5"
                color="error"
                gutterBottom
                sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}
              >
                Error loading data
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3, fontSize: { xs: '0.875rem', md: '1rem' } }}
              >
                {error}
              </Typography>
              <Button
                variant="contained"
                onClick={retryFetch}
                sx={{
                  px: { xs: 2, md: 3 },
                  py: { xs: 1, md: 1.5 },
                  fontSize: { xs: '0.875rem', md: '1rem' },
                }}
              >
                Try Again
              </Button>
            </Box>
          ) : (
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
              <Route path="forecast" element={<Forecast />} />
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
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route path="*" element={<Navigate to="overview" replace />} />
            </Routes>
          )}
        </Box>
      </Box>
    </DashboardContainer>
  );
};

export default Dashboard;