import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Fade } from '@mui/material';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import DataUsageIcon from '@mui/icons-material/DataUsage';

const mockAnalyticsData = {
  populationTrend: {
    labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'Population (Millions)',
        data: [18.1, 18.5, 18.9, 19.3, 19.7, 20.1],
        borderColor: '#3366FF',
        backgroundColor: 'rgba(51,102,255,0.08)',
        fill: true,
        tension: 0.4,
      },
    ],
  },
  ageDistribution: {
    labels: ['0-14', '15-24', '25-54', '55-64', '65+'],
    datasets: [
      {
        label: 'Population (Millions)',
        data: [8.4, 4.2, 6.0, 1.0, 0.6],
        backgroundColor: ['#00ab55', '#3366FF', '#ff5630', '#ff9f43', '#36b9cc'],
        borderRadius: 8,
      },
    ],
  },
  regionalComparison: {
    labels: ['Central', 'Northern', 'Southern'],
    datasets: [
      {
        label: 'Population (Millions)',
        data: [8.1, 3.1, 10.2],
        backgroundColor: ['#3366FF', '#00ab55', '#ff9f43'],
        borderRadius: 8,
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

const Analytics = ({ analyticsData }) => (
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
          <DataUsageIcon sx={{ 
            fontSize: { xs: 32, md: 40 }, 
            color: '#3366FF', 
            mb: -1, 
            mr: 1 
          }} />
          Analytics
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
          Advanced analytics and insights derived from population data analysis.
        </Typography>
        {/* Population Trend Chart */}
        <Card sx={{ 
          borderRadius: { xs: 3, md: 5 }, 
          background: 'rgba(227,234,252,0.7)', 
          boxShadow: '0 4px 24px 0 rgba(51,102,255,0.08)', 
          p: { xs: 1, md: 2 }, 
          mb: { xs: 2, md: 3 } 
        }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Population Trend</Typography>
            <Box sx={{ height: { xs: 200, sm: 250, md: 300 } }}>
              <Line
                data={
                  analyticsData && analyticsData.populationTrend && Array.isArray(analyticsData.populationTrend.datasets)
                    ? analyticsData.populationTrend
                    : mockAnalyticsData.populationTrend
                }
                options={chartOptions}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Shows the historical and recent trend in Malawi's total population.
            </Typography>
          </CardContent>
        </Card>
        {/* Age Distribution Chart */}
        <Card sx={{ 
          borderRadius: { xs: 3, md: 5 }, 
          background: 'rgba(227,252,234,0.7)', 
          boxShadow: '0 4px 24px 0 rgba(0,171,85,0.08)', 
          p: { xs: 1, md: 2 }, 
          mb: { xs: 2, md: 3 } 
        }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Age Distribution</Typography>
            {analyticsData && analyticsData.ageDistribution && analyticsData.ageDistribution.year && (
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
                Year: {analyticsData.ageDistribution.year}
              </Typography>
            )}
            <Box sx={{ height: { xs: 200, sm: 250, md: 220 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Doughnut
                data={
                  analyticsData && analyticsData.ageDistribution && Array.isArray(analyticsData.ageDistribution.datasets)
                    ? analyticsData.ageDistribution
                    : mockAnalyticsData.ageDistribution
                }
                options={chartOptions}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Illustrates the proportion of the population in different age groups.
            </Typography>
          </CardContent>
        </Card>
        {/* Regional Comparison Chart */}
        <Card sx={{ 
          borderRadius: { xs: 3, md: 5 }, 
          background: 'rgba(252,247,227,0.7)', 
          boxShadow: '0 4px 24px 0 rgba(255,171,0,0.08)', 
          p: { xs: 1, md: 2 }, 
          mb: { xs: 2, md: 3 } 
        }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Regional Comparison</Typography>
            <Box sx={{ height: { xs: 200, sm: 250, md: 220 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Bar
                data={
                  analyticsData && analyticsData.regionalComparison && Array.isArray(analyticsData.regionalComparison.datasets)
                    ? analyticsData.regionalComparison
                    : mockAnalyticsData.regionalComparison
                }
                options={chartOptions}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Compares population size across Malawi's regions.
            </Typography>
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
          Key insight: Advanced analytics reveal patterns and trends that help inform policy decisions and resource allocation strategies.
        </Typography>
      </Box>
    </Fade>
  </Box>
);

export default Analytics; 