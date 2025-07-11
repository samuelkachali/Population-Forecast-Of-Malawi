import React, { useRef, useState } from 'react';
import { Box, Typography, Card, CardContent, Fade, Button } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import Snackbar from '@mui/material/Snackbar';

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

const mockHealthData = {
  labels: ['Life Expectancy', 'Infant Mortality', 'Access to Healthcare'],
  datasets: [
    {
      label: 'Value',
      data: [65, 38, 62],
      backgroundColor: ['#00ab55', '#ff5630', '#3366FF'],
      borderRadius: 8,
    },
  ],
};

const HealthMetrics = ({ healthData }) => {
  const data = healthData && Array.isArray(healthData.datasets) ? healthData : mockHealthData;
  const chartRef = useRef(null);
  const [reportStatus, setReportStatus] = useState({ open: false, message: '', error: false });

  const explanation = `The Health Metrics section provides a visual summary of key health indicators for Malawi, using the most recent authoritative data available from the World Bank. The metrics included are:\n\n1. Life Expectancy: The average number of years a newborn is expected to live, assuming current mortality rates remain constant throughout their life. (Unit: Years)\n2. Infant Mortality: The number of deaths of infants under one year old per 1,000 live births. (Unit: Deaths per 1,000 live births)\n3. Access to Basic Sanitation (%): The percentage of the population using at least basic sanitation services, such as improved sanitation facilities that are not shared with other households. (Unit: Percent)\n\nHow the Data is Fetched and Displayed:\n- The dashboard fetches the latest available data for each metric from the World Bank API.\n- If the most recent year’s data is missing, the system automatically uses the most recent year with valid data for each indicator.\n- The data is displayed in a bar chart, with each metric clearly labeled and the year of the data shown for transparency.\n\nWhy These Metrics Matter:\nThese health indicators are essential for understanding the population’s well-being and the effectiveness of public health interventions. Improvements in life expectancy and access to sanitation, and reductions in infant mortality, are key signs of progress in health and development.`;

  const handleGenerateReport = async () => {
    let chartImage = null;
    if (chartRef.current && chartRef.current.canvas) {
      chartImage = chartRef.current.canvas.toDataURL('image/png');
    }
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          healthData: data,
          chartImage,
          explanation,
          reportType: 'health-metrics',
        }),
      });
      if (!response.ok) throw new Error('Failed to generate report');
      setReportStatus({ open: true, message: 'Report generated successfully!', error: false });
    } catch (err) {
      setReportStatus({ open: true, message: 'Failed to generate report.', error: true });
    }
  };

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
          <LocalHospitalIcon sx={{ 
            fontSize: { xs: 32, md: 40 }, 
            color: '#ff6b6b', 
            mb: -1, 
            mr: 1 
          }} />
          Health Metrics
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
          Explore key health indicators and metrics that impact population dynamics in Malawi.
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
                <Bar data={data} options={chartOptions} ref={chartRef} />
            </Box>
          </CardContent>
        </Card>
          {/* Generate Report Button - only if real healthData is available */}
          {healthData && Array.isArray(healthData.datasets) && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleGenerateReport}
                size="large"
              >
                Generate Report
              </Button>
            </Box>
          )}
          <Snackbar
            open={reportStatus.open}
            autoHideDuration={4000}
            onClose={() => setReportStatus({ ...reportStatus, open: false })}
            message={reportStatus.message}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            ContentProps={{ style: { backgroundColor: reportStatus.error ? '#d32f2f' : '#43a047', color: '#fff' } }}
          />
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
          Key insight: Health metrics show improving trends in some areas, though challenges remain in healthcare access and outcomes.
        </Typography>
      </Box>
    </Fade>
  </Box>
);
};

export default HealthMetrics; 