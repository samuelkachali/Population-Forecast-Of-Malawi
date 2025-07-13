console.log('*** RUNNING server/server.js ***');
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const authRoutes = require('./routes/auth'); // Import auth routes
const reportsRouter = require('./routes/reports');
const userRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://population-forecast-of-malawi.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// --- MOCK DATA ---
const statistics = {
  totalPopulation: "21.5M",
  growthRate: "2.8%",
  projection2025: "22.1M",
  northernRegion: "3.2M",
};

const populationTrendData = {
  labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
  datasets: [
    {
      label: 'Population (Millions)',
      data: [19.1, 19.6, 20.1, 20.6, 21.1, 21.5],
      borderColor: '#3f51b5',
      backgroundColor: 'rgba(63, 81, 181, 0.2)',
    },
    {
      label: 'Projection',
      data: [null, null, null, null, 21.1, 22.1],
      borderColor: '#f50057',
      backgroundColor: 'rgba(245, 0, 87, 0.2)',
      borderDash: [5, 5],
    },
  ],
};

const ageDistributionData = {
  labels: ['0-14', '15-24', '25-54', '55-64', '65+'],
  datasets: [
    {
      label: 'Population (%)',
      data: [42, 20, 30, 5, 3],
      backgroundColor: ['#3f51b5', '#f50057', '#4caf50', '#ffc107', '#f44336'],
      borderColor: '#fff',
      borderWidth: 2,
    },
  ],
};

const regionalData = {
  labels: ['Northern', 'Central', 'Southern'],
  datasets: [
    {
      label: 'Population (Millions)',
      data: [3.2, 7.1, 10.8],
      backgroundColor: ['#3f51b5', '#f50057', '#4caf50'],
      borderColor: ['#3f51b5', '#f50057', '#4caf50'],
      borderWidth: 2,
    },
  ],
};

const keyDemographics = {
  urbanPopulation: "17.8%",
  ruralPopulation: "82.2%",
  medianAge: "17.2 years",
  lifeExpectancy: "64.7 years",
};

// --- API ROUTES ---

// Use authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRouter);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/files/reports', (req, res, next) => {
  console.log('Serving file:', req.url);
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});
app.use('/files/reports', express.static(path.join(__dirname, 'utils/data/reports')));

// Route for main statistics cards
app.get('/api/statistics', (req, res) => {
  res.json({
    totalPopulation: {
      label: "Total Population",
      value: "21.5M",
      change: "+2.8% this year",
      icon: "PeopleIcon",
      color: "#2ed47a"
    },
    projection2025: {
      label: "2025 Projection",
      value: "22.1M",
      change: "+2.7% from 2024",
      icon: "TimelineIcon",
      color: "#59bfff"
    },
    northernRegion: {
      label: "Northern Region",
      value: "3.2M",
      change: "+14.8% of total",
      icon: "BarChartIcon",
      color: "#ff6a6a"
    }
  });
});

app.get('/api/population-trend', (req, res) => {
  res.json(populationTrendData);
});

app.get('/api/age-distribution', (req, res) => {
  res.json(ageDistributionData);
});

app.get('/api/regional-distribution', (req, res) => {
  res.json(regionalData);
});

app.get('/api/key-demographics', (req, res) => {
  res.json(keyDemographics);
});

// A simple welcome route
app.get('/', (req, res) => {
  res.send('Population Forecast API is running!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port: ${port}`);
}); 