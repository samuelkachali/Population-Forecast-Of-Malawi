import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, Avatar, Fade, Tooltip, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import CountUp from 'react-countup';

const statCards = [
  {
    label: 'Current Population',
    statKey: 'totalPopulation',
    icon: <PeopleIcon sx={{ fontSize: 36, color: '#00ab55' }} />, bg: 'rgba(227,234,252,0.7)'
  },
  {
    label: 'Annual Growth Rate',
    statKey: 'growthRate',
    icon: <TrendingUpIcon sx={{ fontSize: 36, color: '#3366FF' }} />, bg: 'rgba(245,247,250,0.7)'
  },
  {
    label: 'Median Age',
    statKey: 'medianAge', // fallback only
    icon: <CalendarTodayIcon sx={{ fontSize: 36, color: '#ff9f43' }} />, bg: 'rgba(255,251,230,0.7)'
  },
  {
    label: 'Urban Population',
    statKey: 'urbanPopulation', // fallback only
    icon: <LocationCityIcon sx={{ fontSize: 36, color: '#36b9cc' }} />, bg: 'rgba(230,255,247,0.7)'
  },
];

const MalawiMapSVG = () => (
  <svg width="120" height="180" viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto' }}>
    <path d="M60 10 Q70 30 60 50 Q50 70 70 90 Q90 110 60 130 Q30 150 50 170" stroke="#00ab55" strokeWidth="6" fill="none" />
    <circle cx="60" cy="10" r="7" fill="#3366FF" />
    <circle cx="50" cy="170" r="7" fill="#ff9f43" />
  </svg>
);

const PopulationOverview = ({ stats }) => {
  console.log('PopulationOverview stats:', stats);
  // Simple animated background component
  const AnimatedBackground = () => (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, rgba(227,234,252,0.3) 25%, transparent 25%), linear-gradient(-45deg, rgba(227,234,252,0.3) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(227,234,252,0.3) 75%), linear-gradient(-45deg, transparent 75%, rgba(227,234,252,0.3) 75%)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        animation: 'float 20s ease-in-out infinite',
        zIndex: 0,
        opacity: 0.3
      }}
    />
  );

  // Remove trainData, loading, error, fetchTrainData, and useEffect for trainData

  return (
    <Box
      sx={{
        mt: { xs: 1, md: 2 },
        mb: { xs: 2, md: 4 },
        px: { xs: 1, sm: 2, md: 4 },
        py: { xs: 2, md: 4 },
        position: 'relative',
        overflow: 'visible',
        zIndex: 1,
      }}
    >
      <AnimatedBackground />
      <Fade in timeout={900}>
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Typography 
            variant="h3" 
            fontWeight={800} 
            gutterBottom 
            sx={{ 
              letterSpacing: 1, 
              color: '#212B36', 
              textAlign: 'center', 
              mb: 2,
              fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' }
            }}
          >
            Population Overview
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 2, md: 3 } }}>
            <MalawiMapSVG />
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: { xs: 2, md: 3 }, 
              maxWidth: 700, 
              mx: 'auto', 
              color: '#637381', 
              textAlign: 'center', 
              fontWeight: 400,
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
              px: { xs: 1, md: 0 }
            }}
          >
            Malawi's population is characterized by rapid growth, a youthful age structure, and significant regional diversity. Understanding these trends is crucial for effective policy planning, resource allocation, and sustainable development.
          </Typography>
          <Grid container columns={12} spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 2, md: 3 } }} justifyContent="center">
            {statCards.map((card, i) => (
              <Grid key={card.label} xs={12} sm={6} md={3}>
                <Fade in timeout={700 + i * 200}>
                  <Card
                    sx={{
                      p: { xs: 2, md: 3 },
                      borderRadius: { xs: 3, md: 5 },
                      background: card.bg,
                      boxShadow: '0 4px 24px 0 rgba(0,171,85,0.08)',
                      backdropFilter: 'blur(8px)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minHeight: { xs: 120, md: 150 },
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-6px) scale(1.04)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
                      },
                    }}
                  >
                    <Avatar sx={{ 
                      bgcolor: 'white', 
                      width: { xs: 48, md: 56 }, 
                      height: { xs: 48, md: 56 }, 
                      mb: 1, 
                      boxShadow: 2 
                    }}>
                      {card.icon}
                    </Avatar>
                    <Typography 
                      variant="subtitle2" 
                      color="text.secondary" 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 0.5,
                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                        textAlign: 'center'
                      }}
                    >
                      {card.label}
                    </Typography>
                    <Typography 
                      variant="h5" 
                      fontWeight={800} 
                      sx={{ 
                        color: '#212B36',
                        fontSize: { xs: '1.25rem', md: '1.5rem' }
                      }}
                    >
                      {(() => {
                        if (!stats) return '--';
                        if (card.statKey === 'medianAge') return 17.5;
                        if (card.statKey === 'urbanPopulation') return 18;
                        // For growthRate, do not use fallback, only use backend value
                        if (card.statKey === 'growthRate') {
                          const stat = stats[card.statKey];
                          if (!stat || stat.value === undefined || stat.value === null) return '--';
                          if (typeof stat.value === 'string' && stat.value.endsWith('%')) {
                            return <CountUp end={parseFloat(stat.value)} duration={1.2} suffix="%" decimals={1} />;
                          }
                          if (typeof stat.value === 'number') {
                            return <CountUp end={stat.value} duration={1.2} separator="," decimals={1} />;
                          }
                          return stat.value;
                        }
                        // For all other real stats
                        const stat = stats[card.statKey];
                        if (!stat || stat.value === undefined || stat.value === null) return '--';
                        if (typeof stat.value === 'string' && stat.value.endsWith('%')) {
                          return <CountUp end={parseFloat(stat.value)} duration={1.2} suffix="%" />;
                        }
                        if (typeof stat.value === 'number') {
                          return <CountUp end={stat.value} duration={1.2} separator="," />;
                        }
                        return stat.value;
                      })()}
                    </Typography>
                    {(() => {
                      if (!stats) return null;
                      if (card.statKey === 'medianAge' || card.statKey === 'urbanPopulation') return null;
                      const stat = stats[card.statKey];
                      if (stat && stat.year) {
                        return (
                          <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                            Year: {stat.year}
                          </Typography>
                        );
                      }
                      return null;
                    })()}
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 700, 
              mx: 'auto', 
              textAlign: 'center', 
              fontWeight: 400,
              fontSize: { xs: '0.875rem', md: '1rem' },
              px: { xs: 1, md: 0 }
            }}
          >
            The population overview highlights the most recent estimates and trends. Use the dashboard to explore how the population has changed over time, the distribution by age group, and regional differences across Malawi.
          </Typography>
          {/* Model Fit: Actual vs Predicted section removed */}
        </Box>
      </Fade>
    </Box>
  );
};

export default PopulationOverview; 