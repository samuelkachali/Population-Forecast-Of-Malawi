import React, { useRef, useState } from 'react';
import { Box, Typography, Card, CardContent, Fade, Tooltip } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

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

const mockGrowthData = {
  labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
  datasets: [
    {
      label: 'Growth Rate (%)',
      data: [2.7, 2.6, 2.5, 2.6, 2.7, 2.8],
      backgroundColor: '#00ab55',
      borderRadius: 8,
      barPercentage: 0.6,
    },
  ],
};

const GrowthAnalysis = ({ growthData }) => {
  const chartRef = useRef(null);
  const [reportStatus, setReportStatus] = useState({ open: false, message: '', error: false });
  const data = (growthData && growthData.labels && growthData.datasets) ? growthData : mockGrowthData;
  const explanation = `The Growth Analysis section visualizes Malawi's annual population growth rate using the latest data from the World Bank.\n\n- The growth rate is the percentage change in population from one year to the next.\n- This metric helps identify periods of rapid or slow population change, which is vital for planning in health, education, and infrastructure.\n- The chart displays the most recent years with available data.\n\nA steady or rising growth rate can indicate a young, expanding population, while a declining rate may signal demographic transition or the impact of health and social policies.`;

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
          growthData: data,
          chartImage,
          explanation,
          reportType: 'growth-analysis',
        }),
      });
      if (!response.ok) throw new Error('Failed to generate report');
      setReportStatus({ open: true, message: 'Report generated successfully!', error: false });
    } catch (err) {
      setReportStatus({ open: true, message: 'Failed to generate report.', error: true });
    }
  };

  // Simple animated background component
  const AnimatedBackground = () => (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, rgba(0,171,85,0.05) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,171,85,0.05) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(0,171,85,0.05) 75%), linear-gradient(-45deg, transparent 75%, rgba(0,171,85,0.05) 75%)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        animation: 'float 20s ease-in-out infinite',
        zIndex: 0,
        opacity: 0.3
      }}
    />
  );

  return (
    <Box sx={{ mt: { xs: 1, md: 2 }, mb: { xs: 2, md: 4 }, px: { xs: 1, sm: 2, md: 4 }, position: 'relative' }}>
      <AnimatedBackground />
      <Fade in timeout={900}>
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: { xs: 1, md: 2 } }}>
            <Tooltip title="Shows annual population growth rates for Malawi" arrow>
              <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.13) rotate(-8deg)' } }}>
                <TrendingUpIcon sx={{ 
                  fontSize: { xs: 32, md: 40 }, 
                  color: '#00ab55', 
                  mb: -1, 
                  mr: 1, 
                  transition: 'transform 0.2s' 
                }} />
              </Box>
            </Tooltip>
            <Typography 
              variant="h3" 
              fontWeight={800} 
              gutterBottom 
              sx={{ 
                letterSpacing: 1, 
                color: '#212B36', 
                textAlign: 'center', 
                ml: 1,
                fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' }
              }}
            >
              Growth Analysis
            </Typography>
            {data.yearRange && (
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
                Years: {data.yearRange}
              </Typography>
            )}
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
            Analyze Malawi's annual population growth rates. This chart highlights recent trends and helps identify periods of accelerated or slowed growth.
          </Typography>
          <Fade in timeout={1200}>
            <Card sx={{ 
              borderRadius: { xs: 3, md: 5 }, 
              background: 'linear-gradient(120deg, #e6fff7 0%, #f5f7fa 100%)', 
              border: '2px solid #b2f5ea', 
              boxShadow: '0 8px 32px 0 rgba(0,171,85,0.10)', 
              p: { xs: 1, md: 2 }, 
              mb: { xs: 2, md: 3 }, 
              transition: 'transform 0.2s, box-shadow 0.2s', 
              '&:hover': { 
                transform: 'scale(1.025)', 
                boxShadow: '0 12px 40px 0 rgba(0,171,85,0.18)' 
              } 
            }}>
              <CardContent>
                <Box sx={{ height: { xs: 180, sm: 220, md: 300 } }}>
                  <Box sx={{ height: 350 }}>
                    <Bar data={data} options={chartOptions} ref={chartRef} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Fade>
          {/* Generate Report Button - only if real growthData is available */}
          {growthData && growthData.labels && growthData.datasets && (
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
            Key insight: Malawi's population growth rate has remained steady, with slight fluctuations. Monitoring these changes is vital for planning in health, education, and infrastructure.
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
};

export default GrowthAnalysis; 