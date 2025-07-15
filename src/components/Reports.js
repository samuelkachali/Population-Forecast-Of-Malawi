import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Fade, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import TimelineIcon from '@mui/icons-material/Timeline';
import MapIcon from '@mui/icons-material/Map';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import Snackbar from '@mui/material/Snackbar';
import { useForecast } from '../contexts/ForecastContext';
import { useGrowth } from '../contexts/GrowthContext';
import { useHealth } from '../contexts/HealthContext';
import { useHistorical } from '../contexts/HistoricalContext';

const reportCategories = [
  {
    key: 'demographics',
    title: 'Demographics Report',
    icon: <PeopleIcon color="primary" />, 
    summary: 'Overview of Malawi’s population structure, age groups, and gender distribution.'
  },
  {
    key: 'forecasts',
    title: 'Forecasts Report',
    icon: <TimelineIcon color="secondary" />, 
    summary: 'Population forecasts for coming years based on current trends and models.'
  },
  {
    key: 'regional',
    title: 'Regional Data Report',
    icon: <MapIcon color="success" />, 
    summary: 'Population and demographic breakdown by region.'
  },
  {
    key: 'growth',
    title: 'Growth Analysis Report',
    icon: <TrendingUpIcon color="action" />, 
    summary: 'Analysis of annual population growth rates and trends.'
  },
  {
    key: 'health',
    title: 'Health Metrics Report',
    icon: <HealthAndSafetyIcon color="error" />, 
    summary: 'Key health indicators and metrics impacting population dynamics.'
  },
];

const reportPreviews = {
  demographics: (
    <Box>
      <Typography variant="h6">Demographics Report (Preview)</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Malawi’s population is predominantly young, with over 50% under the age of 18. The gender ratio is nearly balanced. Urbanization is increasing, but most people still live in rural areas.
      </Typography>
    </Box>
  ),
  forecasts: (
    <Box>
      <Typography variant="h6">Forecasts Report (Preview)</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        The population is projected to reach 25 million by 2030, with continued growth expected in both urban and rural areas. Fertility rates are gradually declining.
      </Typography>
    </Box>
  ),
  regional: (
    <Box>
      <Typography variant="h6">Regional Data Report (Preview)</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        The Southern region is the most populous, followed by the Central and Northern regions. Urban centers like Lilongwe and Blantyre are experiencing the fastest growth.
      </Typography>
    </Box>
  ),
  growth: (
    <Box>
      <Typography variant="h6">Growth Analysis Report (Preview)</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Annual growth rates have remained steady at around 2.7%. Monitoring these trends is vital for planning in health, education, and infrastructure.
      </Typography>
    </Box>
  ),
  health: (
    <Box>
      <Typography variant="h6">Health Metrics Report (Preview)</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Life expectancy is improving, but challenges remain in infant mortality and access to basic sanitation. Continued investment in healthcare is needed.
      </Typography>
    </Box>
  ),
};

// Mock data for reports (as used in original components)
const mockForecastRegressors = [
  { ds: '2025', 'Population by 1-year age groups and sex': 1000000, 'Life expectancy E(x) - complete': 65, 'Urban population growth (annual %)': 4.2 },
  { ds: '2026', 'Population by 1-year age groups and sex': 1020000, 'Life expectancy E(x) - complete': 65.2, 'Urban population growth (annual %)': 4.3 },
];
const mockForecastPredictions = [
  { ds: '2025', Predicted_Population: 21000000, Lower_Bound: 20800000, Upper_Bound: 21200000 },
  { ds: '2026', Predicted_Population: 21500000, Lower_Bound: 21300000, Upper_Bound: 21700000 },
];
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
  yearRange: '2018-2023',
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
  year: 2023,
};
const mockTrend = {
  labels: ['2000', '2005', '2010', '2015', '2020', '2023'],
  datasets: [
    {
      label: 'Population (Millions)',
      data: [11.6, 13.1, 14.9, 16.8, 19.1, 20.5],
      borderColor: '#3366FF',
      backgroundColor: 'rgba(51,102,255,0.08)',
      fill: true,
      tension: 0.4,
    },
  ],
};

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://population-forecast-of-malawi.onrender.com";

const Reports = () => {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', error: false });
  const [lastReport, setLastReport] = useState(null);

  const { regressors, predictions, regressorsChartImage, populationChartImage } = useForecast();
  const { growthData, explanation: growthExplanation } = useGrowth();
  const { healthData, explanation: healthExplanation } = useHealth();
  const { populationTrend, explanation: historicalExplanation } = useHistorical();

  // Helper to download a file from a URL
  const downloadFile = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler for downloading each report type
  const handleDownload = async (type) => {
    setLoading(true);
    setError('');
    try {
      let payload = {};
      let filename = '';
      let explanation = '';
      if (type === 'forecasts') {
        payload = {
          regressors,
          predictions,
          regressorsChartImage,
          populationChartImage,
        };
        filename = 'forecast_report.pdf';
        explanation = 'This report provides a forecast of Malawi\'s population based on recent trends and predictive modeling.';
      } else if (type === 'growth') {
        payload = {
          growthData,
          chartImage: undefined,
          explanation: growthExplanation,
          reportType: 'growth-analysis',
        };
        filename = 'growth_analysis_report.pdf';
        explanation = growthExplanation;
      } else if (type === 'health') {
        payload = {
          healthData,
          chartImage: undefined,
          explanation: healthExplanation,
          reportType: 'health-metrics',
        };
        filename = 'health_metrics_report.pdf';
        explanation = healthExplanation;
      } else if (type === 'demographics') {
        setSnackbar({ open: true, message: 'Demographics PDF not implemented.', error: true });
        setLoading(false);
        return;
      } else if (type === 'regional') {
        setSnackbar({ open: true, message: 'Regional Data PDF not implemented.', error: true });
        setLoading(false);
        return;
      } else if (type === 'historical') {
        payload = {
          populationTrend,
          chartImage: undefined,
          explanation: historicalExplanation,
          reportType: 'historical-trend',
        };
        filename = 'historical_trend_report.pdf';
        explanation = historicalExplanation;
      }
      const response = await fetch(`${API_BASE_URL}/api/reports/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to generate report');
      const data = await response.json();
      if (!data.url) throw new Error('No PDF URL returned');
      // Download the PDF (fix: remove /api prefix)
      downloadFile(`${API_BASE_URL}${data.url}`, filename);
      setSnackbar({ open: true, message: 'Report downloaded!', error: false });
      setLastReport({ type, explanation });
    } catch (err) {
      setError(err.message || 'Failed to download report');
      setSnackbar({ open: true, message: err.message || 'Failed to download report', error: true });
    } finally {
      setLoading(false);
    }
  };

  // Helper to check if data exists for each report type
  const hasData = {
    forecasts: regressors && predictions && regressors.length > 0 && predictions.length > 0,
    growth: growthData && Array.isArray(growthData.labels) && growthData.labels.length > 0 && Array.isArray(growthData.datasets) && growthData.datasets.length > 0,
    health: healthData && Array.isArray(healthData.labels) && healthData.labels.length > 0 && Array.isArray(healthData.datasets) && healthData.datasets.length > 0,
    historical: populationTrend && Array.isArray(populationTrend.labels) && populationTrend.labels.length > 0 && Array.isArray(populationTrend.datasets) && populationTrend.datasets.length > 0,
  };

  return (
    <Box sx={{ mt: { xs: 1, md: 2 }, mb: { xs: 2, md: 4 }, px: { xs: 1, sm: 2, md: 4 }, maxWidth: 900, mx: 'auto' }}>
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
            <AssessmentIcon sx={{ 
              fontSize: { xs: 32, md: 40 }, 
              color: '#3366FF', 
              mb: -1, 
              mr: 1 
            }} />
            Reports
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: { xs: 2, md: 3 }, 
              color: '#637381', 
              textAlign: 'center', 
              fontWeight: 400,
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
              px: { xs: 1, md: 0 }
            }}
          >
            Browse different categories of reports. Click a category to preview its summary and download a PDF.
          </Typography>
          <Card sx={{ 
            borderRadius: { xs: 3, md: 5 }, 
            background: 'rgba(227,234,252,0.7)', 
            boxShadow: '0 4px 24px 0 rgba(51,102,255,0.08)', 
            p: { xs: 1, md: 2 } 
          }}>
            <CardContent>
              <List>
                {reportCategories.map((cat) => (
                  <ListItem
                    key={cat.key}
                    button
                    selected={selected === cat.key}
                    onClick={() => setSelected(cat.key)}
                    alignItems="flex-start"
                    divider
                  >
                    <ListItemIcon>{cat.icon}</ListItemIcon>
                    <ListItemText
                      primary={cat.title}
                      secondary={cat.summary}
                    />
                  </ListItem>
                ))}
              </List>
              {selected && (
                <Box sx={{ mt: 3, p: 2, background: '#f5f7fa', borderRadius: 3 }}>
                  {reportPreviews[selected]}
                  {/* Only enable download if data exists, otherwise show a message */}
                  {['forecasts', 'growth', 'health', 'historical'].includes(selected) ? (
                    hasData[selected] ? (
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        disabled={loading}
                        onClick={() => handleDownload(selected)}
                      >
                        {loading ? 'Generating PDF...' : 'Download PDF'}
                      </Button>
                    ) : (
                      <Typography color="warning.main" sx={{ mt: 2 }}>
                        Please generate data in the {reportCategories.find(c => c.key === selected).title} page first.
                      </Typography>
                    )
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      disabled
                    >
                      Not available
                    </Button>
                  )}
                  {error && (
                    <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>
                  )}
                  {/* Show report content and explanation after download */}
                  {lastReport && lastReport.type === selected && (
                    <Box sx={{ mt: 3, p: 2, background: '#e3eafc', borderRadius: 2 }}>
                      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Report Explanation</Typography>
                      <Typography variant="body2">{lastReport.explanation}</Typography>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Fade>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{ style: { backgroundColor: snackbar.error ? '#d32f2f' : '#43a047', color: '#fff' } }}
      />
    </Box>
  );
};

export default Reports; 