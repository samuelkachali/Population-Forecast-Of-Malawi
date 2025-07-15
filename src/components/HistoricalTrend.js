import React, { useRef, useState } from 'react';
import { Box, Typography, Card, CardContent, Fade, CircularProgress, Tooltip } from '@mui/material';
import { Line } from 'react-chartjs-2';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TablePagination from '@mui/material/TablePagination';
import { useHistorical } from '../contexts/HistoricalContext';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    title: { display: false },
  },
  elements: {
    line: { tension: 0.4 },
    point: { radius: 4, hoverRadius: 6 },
  },
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

// Styled table components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 18,
  boxShadow: '0 4px 24px 0 rgba(51,102,255,0.08)',
  background: 'linear-gradient(120deg, #f5f7fa 0%, #e3eafc 100%)',
  marginBottom: theme.spacing(2),
  animation: 'fadeIn 0.7s',
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(24px)' },
    to: { opacity: 1, transform: 'none' },
  },
}));
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: 'rgba(51,102,255,0.08)',
  '& .MuiTableCell-head': {
    fontWeight: 700,
    fontSize: '1.05rem',
    color: '#212B36',
    borderBottom: `2px solid ${theme.palette.primary.light}`,
  },
}));
const StyledTableRow = styled(TableRow)(({ theme, striped }) => ({
  background: striped ? 'rgba(227,234,252,0.35)' : '#fff',
  transition: 'background 0.2s',
  '&:hover': {
    background: 'rgba(51,102,255,0.10)',
  },
}));
const ValueCell = styled(TableCell)(({ theme, diff }) => ({
  fontWeight: 600,
  color:
    diff > 0 ? theme.palette.success.main :
    diff < 0 ? theme.palette.error.main :
    theme.palette.text.secondary,
  fontVariantNumeric: 'tabular-nums',
  fontSize: '1rem',
}));

// Accept populationTrend as a prop
const HistoricalTrend = ({ populationTrend: propPopulationTrend }) => {
  const { populationTrend, setPopulationTrend, explanation, setExplanation } = useHistorical();

  // Prefer prop, then context, then mock
  const [trend, setTrend] = useState(
    propPopulationTrend ||
    populationTrend ||
    {
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
    }
  );

  // Sync context/local state if prop changes
  React.useEffect(() => {
    if (propPopulationTrend) {
      setTrend(propPopulationTrend);
      setPopulationTrend(propPopulationTrend);
    }
  }, [propPopulationTrend, setPopulationTrend]);
  React.useEffect(() => { setExplanation(explanationText); }, []);

  const explanationText = `The Historical Population Trend chart visualizes Malawi's population changes over time using the latest available data from the World Bank.\n\n- The chart shows the total population for each year, highlighting periods of rapid growth or demographic shifts.\n- Understanding these trends is crucial for policy, planning, and anticipating future needs in areas like health, education, and infrastructure.\n- The data is sourced from the World Bank and reflects the most recent historical records.\n\nA steady upward trend indicates sustained population growth, while plateaus or dips may signal demographic transitions or the impact of external events.`;
  const chartRef = useRef(null);
  const [reportStatus, setReportStatus] = useState({ open: false, message: '', error: false });
  const [showPredictions, setShowPredictions] = useState(false);
  const [predLoading, setPredLoading] = useState(false);
  const [predError, setPredError] = useState(null);
  const [trainData, setTrainData] = useState(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://population-forecast-of-malawi.onrender.com";

  const handleGenerateReport = async () => {
    let chartImage = null;
    if (chartRef.current && chartRef.current.canvas) {
      chartImage = chartRef.current.canvas.toDataURL('image/png');
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          populationTrend: trend,
          chartImage,
          explanation: explanationText,
          reportType: 'historical-trend',
        }),
      });
      if (!response.ok) throw new Error('Failed to generate report');
      setReportStatus({ open: true, message: 'Report generated successfully!', error: false });
    } catch (err) {
      setReportStatus({ open: true, message: 'Failed to generate report.', error: true });
    }
  };

  const handleTogglePredictions = async () => {
    if (!showPredictions && !trainData) {
      setPredLoading(true);
      setPredError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/reports/train-predictions`);
        const data = await response.json();
        setTrainData(data);
      } catch (err) {
        setPredError(err.message);
      } finally {
        setPredLoading(false);
      }
    }
    setShowPredictions((prev) => !prev);
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
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
        background: 'linear-gradient(45deg, rgba(51,102,255,0.05) 25%, transparent 25%), linear-gradient(-45deg, rgba(51,102,255,0.05) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(51,102,255,0.05) 75%), linear-gradient(-45deg, transparent 75%, rgba(51,102,255,0.05) 75%)',
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
            <Tooltip title="Shows the historical population trend for Malawi" arrow>
              <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.13) rotate(-8deg)' } }}>
                <TrendingUpIcon sx={{ 
                  fontSize: { xs: 32, md: 40 }, 
                  color: '#3366FF', 
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
              Historical Population Trend
            </Typography>
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
            Explore how Malawi's population has changed over the years. This chart visualizes the historical growth and key turning points in demographic trends.
          </Typography>
          <Fade in timeout={1200}>
            <Card sx={{ 
              borderRadius: { xs: 3, md: 5 }, 
              background: 'linear-gradient(120deg, #e3eafc 0%, #f5f7fa 100%)', 
              border: '2px solid #e0e3e7', 
              boxShadow: '0 8px 32px 0 rgba(51,102,255,0.10)', 
              p: { xs: 1, md: 2 }, 
              mb: { xs: 2, md: 3 }, 
              transition: 'transform 0.2s, box-shadow 0.2s', 
              '&:hover': { 
                transform: 'scale(1.025)', 
                boxShadow: '0 12px 40px 0 rgba(51,102,255,0.18)' 
              } 
            }}>
              <CardContent>
                <Box sx={{ height: { xs: 200, sm: 260, md: 400 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Removed loading and error states as they are handled by context */}
                  {trend && Array.isArray(trend.labels) && trend.labels.length > 0 && Array.isArray(trend.datasets) && trend.datasets.length > 0 ? (
                    <Line data={trend} options={chartOptions} ref={chartRef} />
                  ) : (
                    <Line data={mockTrend} options={chartOptions} />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Fade>
          {/* Generate Report Button - only if real populationTrend data is available */}
          {trend && Array.isArray(trend.labels) && trend.labels.length > 0 && Array.isArray(trend.datasets) && trend.datasets.length > 0 && (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              {/* Removed Generate Report button */}
              <Button
                variant="outlined"
                color="primary"
                onClick={handleTogglePredictions}
                size="large"
              >
                {showPredictions ? 'Hide Predictions' : 'View Predictions'}
              </Button>
            </Box>
          )}
          {/* Actual vs Predicted Table Section */}
          {showPredictions && (
            <Box sx={{ mt: 4 }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                px: 3,
                py: 2,
                background: 'linear-gradient(120deg, #e3eafc 0%, #f5f7fa 100%)',
                borderRadius: 3,
                boxShadow: '0 2px 12px rgba(51,102,255,0.08)',
                width: 'fit-content',
                mx: 'auto',
                minWidth: 320,
              }}>
                <AnalyticsIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h5" fontWeight={700} sx={{ color: '#212B36', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                    Prophet Model: Actual vs Predicted
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                    (1950–2019)
                  </Typography>
                </Box>
              </Box>
              {predLoading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}><CircularProgress /></Box>}
              {predError && <Alert severity="error">{predError}</Alert>}
              {trainData && Array.isArray(trainData) && trainData.length > 0 && (
                <>
                  <StyledTableContainer component={Paper} sx={{ maxWidth: 700, mx: 'auto', mb: 2 }}>
                    <Table size="small">
                      <StyledTableHead>
                        <TableRow>
                          <TableCell>Year</TableCell>
                          <TableCell align="right">Actual</TableCell>
                          <TableCell align="right">
                            Predicted
                            <Tooltip title="Predicted values are from the model fit. Green = overestimate, Red = underestimate." arrow>
                              <InfoOutlinedIcon sx={{ fontSize: 18, ml: 0.5, color: 'primary.main', verticalAlign: 'middle', cursor: 'pointer' }} />
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      </StyledTableHead>
                      <TableBody>
                        {trainData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => {
                          const realIdx = page * rowsPerPage + idx;
                          const diff = (row.predicted ?? 0) - (row.actual ?? 0);
                          return (
                            <StyledTableRow key={row.year} striped={realIdx % 2 === 1}>
                              <TableCell>{row.year}</TableCell>
                              <ValueCell align="right" diff={0}>{row.actual?.toLocaleString()}</ValueCell>
                              <ValueCell align="right" diff={diff}>{row.predicted?.toLocaleString()}</ValueCell>
                            </StyledTableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </StyledTableContainer>
                  {trainData.length > rowsPerPage && (
                    <TablePagination
                      component="div"
                      count={trainData.length}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      rowsPerPageOptions={[]}
                      sx={{ maxWidth: 700, mx: 'auto', mb: 2, borderRadius: 2, background: '#f5f7fa' }}
                    />
                  )}
                </>
              )}
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
            Key insights: Malawi's population has shown steady growth, with notable increases in recent decades. Understanding these trends helps inform policy and planning for the future.
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
};

export default HistoricalTrend; 