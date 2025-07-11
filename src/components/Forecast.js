import React, { useState, useMemo, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Fade,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Snackbar from '@mui/material/Snackbar';
import { useNotification } from '../contexts/NotificationContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Forecast() {
  const [forecastStart, setForecastStart] = useState(2025);
  const [forecastEnd, setForecastEnd] = useState(2027);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [regressorsData, setRegressorsData] = useState(null);
  const [populationData, setPopulationData] = useState(null);
  const [reportStatus, setReportStatus] = useState({ open: false, message: '', error: false });

  const yearsArray = useMemo(() => {
    const years = [];
    for (let y = Number(forecastStart); y <= Number(forecastEnd); y++) {
      years.push(y);
    }
    return years;
  }, [forecastStart, forecastEnd]);

  const { addNotification } = useNotification();

  // Fetch predicted regressors from backend
  const handlePredictRegressors = async () => {
    setLoading(true);
    setError('');
    setPopulationData(null); // Clear old population prediction
    try {
      const response = await fetch('/predict_regressors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ years: yearsArray }),
      });
      if (!response.ok) throw new Error('Failed to fetch regressors');
      const data = await response.json();
      if (Array.isArray(data)) {
      setRegressorsData(data);
      } else {
        setRegressorsData(null);
        setError('Backend returned invalid regressors data.');
      }
    } catch (err) {
      setError('Failed to predict regressors. Try again.');
      setRegressorsData(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch predicted population from backend using predicted regressors
  const handlePredictPopulation = async () => {
    if (!regressorsData) {
      setError('Please predict regressors first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Send the regressors as expected by the backend
      const payload = { regressors: regressorsData };
      console.log("Payload to /predict_population:", payload);
      const response = await fetch('/predict_population', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to fetch population prediction');
      const data = await response.json();
      if (Array.isArray(data)) {
        setPopulationData(data);
        // Add notification for forecast
        addNotification({
          message: `Population forecast generated for years ${yearsArray[0]}-${yearsArray[yearsArray.length-1]}`
        });
      } else {
        setPopulationData(null);
        setError('Backend returned invalid population prediction data.');
      }
    } catch (err) {
      setError('Failed to predict population. Try again.');
      setPopulationData(null);
    } finally {
      setLoading(false);
    }
  };

  const regressorsChartRef = useRef(null);
  const populationChartRef = useRef(null);

  const handleGenerateReport = async () => {
    let regressorsChartImage = null;
    let populationChartImage = null;
    // Try to get base64 images from the chart canvases
    if (regressorsChartRef.current && regressorsChartRef.current.canvas) {
      regressorsChartImage = regressorsChartRef.current.canvas.toDataURL('image/png');
    }
    if (populationChartRef.current && populationChartRef.current.canvas) {
      populationChartImage = populationChartRef.current.canvas.toDataURL('image/png');
    }
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          regressors: regressorsData,
          predictions: populationData,
          regressorsChartImage,
          populationChartImage,
        }),
      });
      if (!response.ok) throw new Error('Failed to generate report');
      setReportStatus({ open: true, message: 'Report generated successfully!', error: false });
    } catch (err) {
      setReportStatus({ open: true, message: 'Failed to generate report.', error: true });
    }
  };

  // Chart data for regressors
  const regressorsChartData = useMemo(() => {
    if (!Array.isArray(regressorsData) || regressorsData.length === 0) return null;
    return {
      labels: regressorsData.map((d) => d.ds),
    datasets: [
      {
          label: 'Population by 1-year age groups and sex',
          data: regressorsData.map((d) => d["Population by 1-year age groups and sex"]),
        borderColor: '#1976d2',
          fill: false,
        },
        {
          label: 'Life expectancy E(x) - complete',
          data: regressorsData.map((d) => d["Life expectancy E(x) - complete"]),
          borderColor: '#43a047',
          fill: false,
        },
        {
          label: 'Urban population growth (annual %)',
          data: regressorsData.map((d) => d["Urban population growth (annual %)"]),
          borderColor: '#f57c00',
          fill: false,
        },
      ],
    };
  }, [regressorsData]);

  // Chart data for population
  const populationChartData = useMemo(() => {
    if (!Array.isArray(populationData) || populationData.length === 0) return null;
    return {
      labels: populationData.map((d) => d.ds),
    datasets: [
      {
          label: 'Predicted Population',
          data: populationData.map((d) => d.Predicted_Population),
          borderColor: '#d32f2f',
          fill: false,
        },
        {
          label: 'Lower Bound',
          data: populationData.map((d) => d.Lower_Bound),
          borderColor: '#f44336',
          borderDash: [5, 5],
          fill: false,
        },
        {
          label: 'Upper Bound',
          data: populationData.map((d) => d.Upper_Bound),
          borderColor: '#f44336',
          borderDash: [5, 5],
          fill: false,
        },
      ],
    };
  }, [populationData]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
            Population Forecast
          </Typography>

      <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <TextField
            label="Start Year"
            type="number"
            fullWidth
            value={forecastStart}
            onChange={(e) => setForecastStart(e.target.value)}
            inputProps={{ min: 2022, max: 2100 }}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            label="End Year"
            type="number"
            fullWidth
            value={forecastEnd}
            onChange={(e) => setForecastEnd(e.target.value)}
            inputProps={{ min: forecastStart, max: 2100 }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            onClick={handlePredictRegressors}
            disabled={loading || forecastEnd < forecastStart}
            fullWidth
          >
            {loading ? 'Predicting...' : 'Predict Regressors'}
          </Button>
                </Grid>
        <Grid item xs={12} sm={3}>
                  <Button
            variant="outlined"
            onClick={handlePredictPopulation}
            disabled={loading || !regressorsData}
                    fullWidth
                  >
            {loading ? 'Predicting...' : 'Predict Population'}
                  </Button>
                </Grid>
              </Grid>

      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Regressors Chart */}
      {regressorsChartData && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Predicted Regressors
            </Typography>
            <Line data={regressorsChartData} ref={regressorsChartRef} />
            </CardContent>
          </Card>
      )}

      {/* Regressors Table */}
      {regressorsData && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Predicted Regressors (Table)
            </Typography>
            <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
              <Table size="small" sx={{ minWidth: 400 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Population by 1-year age groups and sex</TableCell>
                    <TableCell align="right">Life expectancy E(x) - complete</TableCell>
                    <TableCell align="right">Urban population growth (annual %)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {regressorsData.map((row, idx) => (
                    <TableRow key={idx} sx={{ backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>
                      <TableCell>{row.ds}</TableCell>
                      <TableCell align="right">{Number(row["Population by 1-year age groups and sex"]).toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                      <TableCell align="right">{Number(row["Life expectancy E(x) - complete"]).toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                      <TableCell align="right">{Number(row["Urban population growth (annual %)"]).toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Population Chart */}
      {populationChartData && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Predicted Population
            </Typography>
            <Line data={populationChartData} ref={populationChartRef} />
          </CardContent>
        </Card>
      )}

      {/* Population Table */}
      {populationData && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Predicted Population (Table)
            </Typography>
            <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
              <Table size="small" sx={{ minWidth: 400 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Predicted Population</TableCell>
                    <TableCell align="right">Lower Bound</TableCell>
                    <TableCell align="right">Upper Bound</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {populationData.map((row, idx) => (
                    <TableRow key={idx} sx={{ backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>
                      <TableCell>{row.ds}</TableCell>
                      <TableCell align="right">{Number(row.Predicted_Population).toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                      <TableCell align="right">{Number(row.Lower_Bound).toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                      <TableCell align="right">{Number(row.Upper_Bound).toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Generate Report Button - appears only if both regressors and predictions are available */}
      {regressorsData && populationData && (
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
    </Box>
  );
} 
