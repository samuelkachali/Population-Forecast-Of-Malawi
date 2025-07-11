import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import Dashboard from './components/Dashboard';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Welcome from './components/Welcome';
import About from './components/About';
import ProtectedRoute from './components/ProtectedRoute';
import InactivityWarning from './components/InactivityWarning';
import useInactivityTimer from './hooks/useInactivityTimer';
import 'chartjs-adapter-date-fns';
import HistoricalTrend from './components/HistoricalTrend';
import GrowthAnalysis from './components/GrowthAnalysis';
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { UserProvider } from './contexts/UserContext';

function AppRoutes() {
  // Use the inactivity timer hook (60 minutes timeout, 5 minutes warning)
  const { showWarning, handleStayLoggedIn, handleLogout } = useInactivityTimer(60, 5);

  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/history" element={<HistoricalTrend loading={false} error={null} populationTrend={{ labels: ['2000', '2005', '2010', '2015', '2020', '2023'], datasets: [{ label: 'Population (Millions)', data: [11.6, 13.1, 14.9, 16.8, 19.1, 20.5], borderColor: '#3366FF', backgroundColor: 'rgba(51,102,255,0.08)', fill: true, tension: 0.4 }] }} />} />
        <Route path="/overview" element={<Navigate to="/dashboard/overview" replace />} />
        <Route path="/growth" element={<Navigate to="/dashboard/growth" replace />} />
        <Route path="/compare" element={<Navigate to="/dashboard/compare" replace />} />
        <Route path="/age-groups" element={<Navigate to="/dashboard/age-groups" replace />} />
        <Route path="/regions" element={<Navigate to="/dashboard/regions" replace />} />
        <Route path="/urban-rural" element={<Navigate to="/dashboard/urban-rural" replace />} />
        <Route path="/education" element={<Navigate to="/dashboard/education" replace />} />
        <Route path="/health" element={<Navigate to="/dashboard/health" replace />} />
        <Route path="/analytics" element={<Navigate to="/dashboard/analytics" replace />} />
        <Route path="/reports" element={<Navigate to="/dashboard/reports" replace />} />
        <Route path="/demographics" element={<Navigate to="/dashboard/demographics" replace />} />
        <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
        <Route path="/profile" element={<Navigate to="/dashboard/profile" replace />} />
        <Route path="/notifications" element={<Navigate to="/dashboard/notifications" replace />} />
        <Route path="/help" element={<Navigate to="/dashboard/help" replace />} />
        <Route path="/terms" element={<Navigate to="/dashboard/terms" replace />} />
      </Routes>
      
      <InactivityWarning
        isOpen={showWarning}
        onStayLoggedIn={handleStayLoggedIn}
        onLogout={handleLogout}
      />
    </>
  );
}

function AppThemeProvider({ children }) {
  const { theme } = useThemeContext();
  const muiTheme = React.useMemo(() => createTheme({
    palette: {
      mode: theme,
      primary: { main: '#00ab55' },
      secondary: { main: '#3366FF' },
      error: { main: '#ff5630' },
      warning: { main: '#ff9f43' },
      info: { main: '#36b9cc' },
      success: { main: '#00ab55' },
      background: {
        default: theme === 'dark' ? '#181A1B' : '#f9fafb',
        paper: theme === 'dark' ? '#23272F' : '#ffffff',
      },
      text: {
        primary: theme === 'dark' ? '#F4F6F8' : '#212B36',
        secondary: theme === 'dark' ? '#B0B8C1' : '#637381',
      },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
      MuiPaper: { styleOverrides: { root: { boxShadow: '0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)' } } },
    },
  }), [theme]);
  return <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>;
}

function App() {
  return (
    <UserProvider>
      <NotificationProvider>
        <ThemeProvider>
          <AppThemeProvider>
            <Router>
              <AppRoutes />
            </Router>
          </AppThemeProvider>
        </ThemeProvider>
      </NotificationProvider>
    </UserProvider>
  );
}

export default App;
