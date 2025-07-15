import React, { useContext, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Fade } from '@mui/material';
import { Bar, Doughnut } from 'react-chartjs-2';
import GroupsIcon from '@mui/icons-material/Groups';
import PeopleIcon from '@mui/icons-material/People';
import { DemographicsContext } from '../contexts/DemographicsContext';

const mockDemographicsData = {
  gender: {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Population (%)',
        data: [49, 51],
        backgroundColor: ['#3366FF', '#ff9f43'],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  },
  pyramid: {
    labels: ['0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65+'],
    datasets: [
      {
        label: 'Male',
        data: [1.2, 1.1, 1.1, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.1],
        backgroundColor: '#3366FF',
        borderRadius: 6,
      },
      {
        label: 'Female',
        data: [1.1, 1.1, 1.0, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.1],
        backgroundColor: '#ff9f43',
        borderRadius: 6,
      },
    ],
  },
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    title: { display: false },
    tooltip: { mode: 'index', intersect: false },
  },
};

const Demographics = ({ demographicsData }) => {
  const { setDemographicsData } = useContext(DemographicsContext);
  useEffect(() => {
    if (demographicsData) {
      setDemographicsData(demographicsData);
      console.log("Set demographics context:", demographicsData);
    }
  }, [demographicsData, setDemographicsData]);
  const genderData = demographicsData && demographicsData.gender && Array.isArray(demographicsData.gender.datasets)
    ? demographicsData.gender
    : mockDemographicsData.gender;
  const pyramidData = demographicsData && demographicsData.pyramid && Array.isArray(demographicsData.pyramid.datasets)
    ? demographicsData.pyramid
    : mockDemographicsData.pyramid;
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
              color: '#00ab55', 
              mb: -1, 
              mr: 1 
            }} />
            Demographics
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
            Comprehensive demographic analysis including age, gender, and population structure.
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: { xs: 3, md: 5 }, background: 'rgba(230,255,247,0.7)', boxShadow: '0 4px 24px 0 rgba(0,171,85,0.08)', p: { xs: 1, md: 2 }, mb: { xs: 2, md: 3 } }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Gender Distribution {genderData.year && `(Year: ${genderData.year})`}</Typography>
                  <Box sx={{ height: { xs: 200, sm: 250, md: 220 } }}>
                    <Doughnut data={genderData} options={chartOptions} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: { xs: 3, md: 5 }, background: 'rgba(230,255,247,0.7)', boxShadow: '0 4px 24px 0 rgba(0,171,85,0.08)', p: { xs: 1, md: 2 }, mb: { xs: 2, md: 3 } }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Population Pyramid {pyramidData.year && `(Year: ${pyramidData.year})`}</Typography>
                  <Box sx={{ height: { xs: 200, sm: 250, md: 220 } }}>
                    <Bar data={pyramidData} options={chartOptions} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
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
            Key insight: Demographic analysis shows a young population with balanced gender distribution, indicating future growth potential.
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
};

export default Demographics; 