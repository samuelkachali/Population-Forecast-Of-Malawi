import React, { useContext, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Fade } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { RegionalContext } from '../contexts/RegionalContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: { mode: 'index', intersect: false },
  },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true, grid: { color: '#e3eafc' } },
  },
};

const mockRegionalData = {
  labels: ['Central', 'Northern', 'Southern'],
  datasets: [
    {
      label: 'Population (Millions)',
      data: [8.1, 3.1, 10.2],
      backgroundColor: ['#3366FF', '#00ab55', '#ff9f43'],
      borderRadius: 8,
    },
  ],
};

const RegionalData = ({ regionalData }) => {
  const { setRegionalData } = useContext(RegionalContext);
  useEffect(() => {
    if (regionalData) {
      setRegionalData(regionalData);
    }
  }, [regionalData, setRegionalData]);
  const year = regionalData && regionalData.year;
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
            <LocationOnIcon sx={{ 
              fontSize: { xs: 32, md: 40 }, 
              color: '#00ab55', 
              mb: -1, 
              mr: 1 
            }} />
            Regional Data
          </Typography>
          {year && (
            <Typography variant="subtitle1" align="center" sx={{ color: '#00B8D9', mb: 1 }}>
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
            Compare population data across Malawi's regions. This chart shows the distribution and density variations.
          </Typography>
          <Card sx={{ 
            borderRadius: { xs: 3, md: 5 }, 
            background: 'rgba(230,255,247,0.7)', 
            boxShadow: '0 4px 24px 0 rgba(0,171,85,0.08)', 
            p: { xs: 1, md: 2 }, 
            mb: { xs: 2, md: 3 } 
          }}>
            <CardContent>
              <Box sx={{ height: { xs: 200, sm: 250, md: 300 } }}>
                <Bar data={regionalData || mockRegionalData} options={chartOptions} />
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
            Key insight: Population distribution varies significantly across regions, with Southern Region having the highest population density.
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
};

export default RegionalData; 