import React from 'react';
import { Box, Grid, Typography, Paper, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InsightsIcon from '@mui/icons-material/Insights';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CountUp from 'react-countup';

const valueProps = [
  {
    icon: <InsightsIcon sx={{ fontSize: 38, color: 'primary.main' }} />, 
    title: 'Instant Insights',
    desc: 'Get population forecasts and trends in seconds with our smart analytics engine.'
  },
  {
    icon: <BarChartIcon sx={{ fontSize: 38, color: 'success.main' }} />, 
    title: 'Visualize Data',
    desc: 'Interactive charts and maps make complex data easy to understand.'
  },
  {
    icon: <AssessmentIcon sx={{ fontSize: 38, color: 'secondary.main' }} />, 
    title: 'Actionable Reports',
    desc: 'Download ready-to-use reports to support your planning and decisions.'
  },
];

const impactStats = [
  {
    icon: <TrendingUpIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
    label: 'Forecasts Generated',
    value: 12450,
  },
  {
    icon: <PeopleIcon sx={{ fontSize: 32, color: 'success.main' }} />,
    label: 'Regions Analyzed',
    value: 3,
  },
  {
    icon: <AssessmentIcon sx={{ fontSize: 32, color: 'secondary.main' }} />,
    label: 'Reports Downloaded',
    value: 3120,
  },
];

const FeatureCardsSection = () => {
  const theme = useTheme();
  return (
    <Box sx={{ my: 8, px: { xs: 2, sm: 4, md: 0 } }}>
      {/* How It Works / Value Props */}
      <Typography variant="h5" fontWeight={800} align="center" mb={4} sx={{ color: 'rgba(40, 40, 53, 0.83)', letterSpacing: 1, fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2.5rem' } }}>
        How It Works
      </Typography>
      <Grid container spacing={3} justifyContent="center" alignItems="stretch" sx={{ mb: 4 }}>
        {valueProps.map((prop) => (
          <Grid item xs={12} sm={6} md={4} key={prop.title}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 3,
                p: { xs: 2, md: 4 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 2px 12px rgba(33,150,243,0.08)',
                background: '#fff',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px) scale(1.03)',
                  boxShadow: '0 8px 32px 0 rgba(33,150,243,0.13)',
                },
              }}
            >
              <Box mb={1}>{React.cloneElement(prop.icon, { fontSize: 'medium' })}</Box>
              <Typography variant="subtitle1" fontWeight={700} mb={0.5} sx={{ color: 'primary.dark', fontSize: { xs: '1rem', md: '1.25rem' } }}>{prop.title}</Typography>
              <Typography variant="body2" color="text.secondary">{prop.desc}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      {/* Impact Stats */}
      <Grid container spacing={2} justifyContent="center" alignItems="stretch">
        {impactStats.map((stat) => (
          <Grid item xs={12} sm={4} key={stat.label}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                p: { xs: 2, md: 3 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'linear-gradient(90deg, #e3eafc 0%, #f5f7fa 100%)',
                boxShadow: '0 2px 8px rgba(33,150,243,0.07)',
              }}
            >
              <Box mb={0.5}>{React.cloneElement(stat.icon, { fontSize: 'medium' })}</Box>
              <Typography variant="h6" fontWeight={800} sx={{ color: 'primary.main', mb: 0.5, fontSize: { xs: '1.1rem', md: '1.5rem' } }}>
                <CountUp end={stat.value} duration={2} separator="," />
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>{stat.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeatureCardsSection; 
