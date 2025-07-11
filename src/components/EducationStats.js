import React from 'react';
import { Box, Typography, Card, CardContent, Fade } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import SchoolIcon from '@mui/icons-material/School';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
    title: { display: false },
    tooltip: { mode: 'index', intersect: false },
  },
};

const mockEducationData = {
  labels: ['No Schooling', 'Primary', 'Secondary', 'Tertiary'],
  datasets: [
    {
      label: 'Population (%)',
      data: [18, 56, 22, 4],
      backgroundColor: ['#ff5630', '#00ab55', '#3366FF', '#ff9f43'],
      borderWidth: 2,
      borderColor: '#fff',
    },
  ],
};

const EducationStats = ({ educationData }) => (
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
          <SchoolIcon sx={{ 
            fontSize: { xs: 32, md: 40 }, 
            color: '#4ecdc4', 
            mb: -1, 
            mr: 1 
          }} />
          Education Statistics
        </Typography>
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
          Explore education statistics and literacy rates across different demographics in Malawi.
        </Typography>
        <Card sx={{ 
          borderRadius: { xs: 3, md: 5 }, 
          background: 'rgba(235,255,255,0.7)', 
          boxShadow: '0 4px 24px 0 rgba(78,205,196,0.08)', 
          p: { xs: 1, md: 2 }, 
          mb: { xs: 2, md: 3 } 
        }}>
          <CardContent>
            <Box sx={{ height: { xs: 200, sm: 250, md: 300 } }}>
              <Doughnut data={educationData || mockEducationData} options={chartOptions} />
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
          Key insight: Education levels vary significantly, with primary education being the most common level achieved.
        </Typography>
      </Box>
    </Fade>
  </Box>
);

export default EducationStats; 