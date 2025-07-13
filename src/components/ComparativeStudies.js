import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Fade, CircularProgress, Alert } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import CompareIcon from '@mui/icons-material/Compare';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    title: { display: false },
    tooltip: { mode: 'index', intersect: false },
  },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true, grid: { color: '#e3eafc' } },
  },
};

const mockCompareData = {
  labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
  datasets: [
    {
      label: 'Central',
      data: [7.1, 7.3, 7.5, 7.7, 7.9, 8.1],
      backgroundColor: '#3366FF',
      borderRadius: 8,
    },
    {
      label: 'Northern',
      data: [2.6, 2.7, 2.8, 2.9, 3.0, 3.1],
      backgroundColor: '#00ab55',
      borderRadius: 8,
    },
    {
      label: 'Southern',
      data: [9.2, 9.4, 9.6, 9.8, 10.0, 10.2],
      backgroundColor: '#ff9f43',
      borderRadius: 8,
    },
  ],
};

const mockComparativeData = {
  labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
  datasets: [
    {
      label: 'Malawi',
      data: [1.5, 1.6, 1.7, 1.8, 1.9, 2.0],
      backgroundColor: '#3366FF',
      borderRadius: 8,
    },
    {
      label: 'Tanzania',
      data: [1.2, 1.3, 1.4, 1.5, 1.6, 1.7],
      backgroundColor: '#00ab55',
      borderRadius: 8,
    },
    {
      label: 'Mozambique',
      data: [1.0, 1.1, 1.2, 1.3, 1.4, 1.5],
      backgroundColor: '#ff9f43',
      borderRadius: 8,
    },
  ],
};

const ComparativeStudies = () => {
  const [comparativeData, setComparativeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://population-forecast-of-malawi.onrender.com";
        const res = await fetch(`${API_BASE_URL}/api/dashboard/comparative-studies`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) throw new Error('Failed to fetch comparative studies data');
        const data = await res.json();
        setComparativeData(data);
      } catch (err) {
        setError('Could not load real comparative data. Showing mock data.');
        setComparativeData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
            <CompareArrowsIcon sx={{ 
              fontSize: { xs: 32, md: 40 }, 
              color: '#9c27b0', 
              mb: -1, 
              mr: 1 
            }} />
            Comparative Studies
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
            Compare Malawi's population growth rate with other countries in the region and globally.
          </Typography>
          <Card sx={{ 
            borderRadius: { xs: 3, md: 5 }, 
            background: 'rgba(245,235,255,0.7)', 
            boxShadow: '0 4px 24px 0 rgba(156,39,176,0.08)', 
            p: { xs: 1, md: 2 }, 
            mb: { xs: 2, md: 3 } 
          }}>
            <CardContent>
              <Box sx={{ height: { xs: 200, sm: 250, md: 300 } }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>
                ) : null}
                <Bar data={comparativeData || mockComparativeData} options={chartOptions} />
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
            Key insight: Malawi's population growth rate is comparable to other developing nations in the region, with similar demographic challenges and opportunities.
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
};

export default ComparativeStudies; 