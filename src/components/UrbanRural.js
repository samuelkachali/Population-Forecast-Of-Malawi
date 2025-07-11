import React from 'react';
import { Box, Typography, Card, CardContent, Fade } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import LocationCityIcon from '@mui/icons-material/LocationCity';

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
    title: { display: false },
    tooltip: { mode: 'index', intersect: false },
  },
};

const mockUrbanRuralData = {
  labels: ['Urban', 'Rural'],
  datasets: [
    {
      label: 'Population (Millions)',
      data: [3.6, 17.0],
      backgroundColor: ['#3366FF', '#00ab55'],
      borderWidth: 2,
      borderColor: '#fff',
    },
  ],
};

const UrbanRural = ({ urbanRuralData }) => {
  const data = urbanRuralData && Array.isArray(urbanRuralData.datasets) ? urbanRuralData : mockUrbanRuralData;
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
            <LocationCityIcon sx={{ 
              fontSize: { xs: 32, md: 40 }, 
              color: '#ff6b6b', 
              mb: -1, 
              mr: 1 
            }} />
            Urban vs Rural
          </Typography>
          {data.year && (
            <Typography
              variant="subtitle2"
              sx={{
                color: '#637381',
                textAlign: 'center',
                mb: { xs: 1, md: 2 },
                fontWeight: 500,
                fontSize: { xs: '0.95rem', md: '1.05rem' },
                letterSpacing: 0.5,
              }}
            >
              Year: {data.year}
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
            Compare urban and rural population distribution. This chart shows the balance between city and countryside populations.
          </Typography>
          <Card sx={{ 
            borderRadius: { xs: 3, md: 5 }, 
            background: 'rgba(255,235,235,0.7)', 
            boxShadow: '0 4px 24px 0 rgba(255,107,107,0.08)', 
            p: { xs: 1, md: 2 }, 
            mb: { xs: 2, md: 3 } 
          }}>
            <CardContent>
              <Box sx={{ height: { xs: 200, sm: 250, md: 300 } }}>
                <Doughnut data={data} options={chartOptions} />
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
            Key insight: Malawi remains predominantly rural, with most of the population living in rural areas, though urbanization is gradually increasing.
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
};

export default UrbanRural; 