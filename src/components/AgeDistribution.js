import React from 'react';
import { Box, Typography, Card, CardContent, Fade } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import PeopleIcon from '@mui/icons-material/People';
import { useState } from 'react';

const chartOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: { mode: 'index', intersect: false },
  },
  scales: {
    x: { beginAtZero: true, grid: { color: '#e3eafc' } },
    y: { grid: { display: false } },
  },
};

const mockAgeData = {
  labels: ['0-14', '15-24', '25-54', '55-64', '65+'],
  datasets: [
    {
      label: 'Population (Millions)',
      data: [8.4, 4.2, 6.0, 1.0, 0.6],
      backgroundColor: ['#00ab55', '#3366FF', '#ff5630', '#ff9f43', '#36b9cc'],
      borderRadius: 8,
    },
  ],
};

const getYear = (realAgeDistribution) => {
  // Try to extract the year from the World Bank data structure
  if (
    realAgeDistribution &&
    realAgeDistribution.datasets &&
    realAgeDistribution.datasets[0] &&
    realAgeDistribution.datasets[0].meta &&
    realAgeDistribution.datasets[0].meta.year
  ) {
    return realAgeDistribution.datasets[0].meta.year;
  }
  // Fallback: try to get from the label if present
  if (
    realAgeDistribution &&
    realAgeDistribution.year
  ) {
    return realAgeDistribution.year;
  }
  return null;
};

const AgeDistribution = ({ realAgeDistribution }) => {
  const year = getYear(realAgeDistribution);
  return (
    <Box sx={{ mt: { xs: 1, md: 2 }, mb: { xs: 2, md: 4 }, px: { xs: 1, sm: 2, md: 4 } }}>
      <Fade in timeout={900}>
        <Box>
          <Typography 
            variant="h3" 
            fontWeight={800} 
            gutterBottom 
            sx={{ 
              letterSpacing: 1, 
              color: '#212B36', 
              textAlign: 'center', 
              mb: { xs: 1, md: 2 },
              fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' }
            }}
          >
            <PeopleIcon sx={{ 
              fontSize: { xs: 32, md: 40 }, 
              color: '#ff9f43', 
              mb: -1, 
              mr: 1 
            }} />
            Age Distribution
          </Typography>
          {year && (
            <Typography variant="subtitle1" align="center" sx={{ color: '#3366FF', mb: 1 }}>
              Data Year: {year}
            </Typography>
          )}
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
            Explore the age structure of Malawi's population using real World Bank data.
          </Typography>
          <Card sx={{ 
            borderRadius: { xs: 3, md: 5 }, 
            background: 'rgba(255,251,230,0.7)', 
            boxShadow: '0 4px 24px 0 rgba(255,159,67,0.08)', 
            p: { xs: 1, md: 2 }, 
            mb: { xs: 2, md: 3 } 
          }}>
            <CardContent>
              <Box sx={{ height: { xs: 200, sm: 250, md: 300 } }}>
                {realAgeDistribution ? (
                  <Bar data={realAgeDistribution} options={chartOptions} />
                ) : (
                  <Typography color="error" align="center">No real age distribution data available.</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
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
            Key insight: Malawi has a young population with a large proportion under 25 years old, indicating high fertility rates and future growth potential.
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
};

export default AgeDistribution;
