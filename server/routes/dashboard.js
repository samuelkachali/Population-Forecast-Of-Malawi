const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getPopulationData } = require('../utils/worldBankApi');
const fetch = require('node-fetch');

// Mock data for the dashboard
const mockData = {
  stats: {
    totalPopulation: { label: 'Total Population', value: '20.4M', change: '+2.1%', icon: 'PeopleIcon', color: '#54D62C' },
    growthRate: { label: 'Growth Rate', value: '2.6%', change: '+0.2%', icon: 'TimelineIcon', color: '#FFC107' },
    population2025: { label: '2025 Projection', value: '22.1M', change: '+1.7M', icon: 'TrendingUpIcon', color: '#00B8D9' }
  },
  populationTrend: {
    labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
    datasets: [{
      label: 'Population (in Millions)',
      data: [18.1, 18.6, 19.2, 19.8, 20.4, 21.0],
      borderColor: '#367BFA',
      backgroundColor: 'rgba(54, 123, 250, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  },
  ageDistribution: {
    labels: ['0-14 years', '15-64 years', '65+ years'],
    datasets: [{
      data: [44, 53, 3],
      backgroundColor: ['#367BFA', '#54D62C', '#FFC107'],
      hoverOffset: 4,
    }],
  },
  regionalDistribution: {
    labels: ['Northern', 'Central', 'Southern'],
    datasets: [{
        label: 'Population (Millions)',
        data: [3.5, 8.2, 8.7],
        backgroundColor: ['#00B8D9', '#FFC107', '#FF4842'],
        barThickness: 20,
    }],
  }
};

// 2018 Malawi Population and Housing Census regional data
const regionalCensus2018 = {
  labels: ['Northern', 'Central', 'Southern'],
  datasets: [{
    label: 'Population (2018 Census)',
    data: [2289780, 7523340, 7750629],
    backgroundColor: ['#00B8D9', '#FFC107', '#FF4842'],
    barThickness: 20,
  }],
  year: 2018,
};

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const { stats } = await getPopulationData();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats.', error: error.message });
  }
});

// @desc    Get population trend data
// @route   GET /api/dashboard/population-trend
// @access  Private
router.get('/population-trend', protect, async (req, res) => {
    try {
      const { populationTrend } = await getPopulationData();
      res.json(populationTrend);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch population trend.', error: error.message });
    }
});

// @desc    Get population trend data (public endpoint for Welcome page)
// @route   GET /api/dashboard/population-trend-public
// @access  Public
router.get('/population-trend-public', async (req, res) => {
    try {
      const { populationTrend } = await getPopulationData();
      res.json(populationTrend);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch population trend.', error: error.message });
    }
});

// @desc    Get age distribution data
// @route   GET /api/dashboard/age-distribution
// @access  Private
router.get('/age-distribution', protect, async (req, res) => {
  try {
    // World Bank indicators for Malawi
    const indicators = [
      { code: 'SP.POP.0014.TO.ZS', label: '0-14 years' },
      { code: 'SP.POP.1564.TO.ZS', label: '15-64 years' },
      { code: 'SP.POP.65UP.TO.ZS', label: '65+ years' },
    ];
    const results = await Promise.all(
      indicators.map(ind =>
        fetch(`https://api.worldbank.org/v2/country/MWI/indicator/${ind.code}?format=json&per_page=1`)
          .then(r => r.json())
          .then(data => ({
            label: ind.label,
            value: data[1] && data[1][0] ? data[1][0].value : null,
            year: data[1] && data[1][0] ? data[1][0].date : null
          }))
      )
    );
    const year = results[0].year;
    const realData = {
      labels: results.map(r => r.label),
      datasets: [{
        data: results.map(r => r.value),
        backgroundColor: ['#367BFA', '#54D62C', '#FFC107'],
        hoverOffset: 4,
      }],
      year,
    };
    res.json({ real: realData, mock: mockData.ageDistribution });
  } catch (error) {
    // Fallback to mock data if API fails
    res.json({ real: null, mock: mockData.ageDistribution });
  }
});

// @desc    Get regional distribution data
// @route   GET /api/dashboard/regional-distribution
// @access  Private
router.get('/regional-distribution', protect, (req, res) => {
  res.json(regionalCensus2018);
});

// @desc    Get demographics data (gender distribution and population pyramid)
// @route   GET /api/dashboard/demographics
// @access  Private
router.get('/demographics', protect, async (req, res) => {
  try {
    // World Bank indicators for gender distribution (latest year)
    const indicators = [
      { code: 'SP.POP.TOTL.FE.ZS', label: 'Female' },
      { code: 'SP.POP.TOTL.MA.ZS', label: 'Male' },
    ];
    const results = await Promise.all(
      indicators.map(ind =>
        fetch(`https://api.worldbank.org/v2/country/MWI/indicator/${ind.code}?format=json&per_page=1`)
          .then(r => r.json())
          .then(data => ({
            label: ind.label,
            value: data[1] && data[1][0] ? data[1][0].value : null,
            year: data[1] && data[1][0] ? data[1][0].date : null
          }))
      )
    );
    const gender = {
      labels: results.map(r => r.label),
      datasets: [
        {
          label: 'Population (%)',
          data: results.map(r => r.value),
          backgroundColor: ['#3366FF', '#ff9f43'],
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
      year: results[0].year,
    };

    // Static population pyramid (2018 Malawi Census, % of total population by age group and gender)
    // Source: https://www.nsomalawi.mw/images/stories/data_on_line/demography/census_2018/2018%20Malawi%20Population%20and%20Housing%20Census%20Main%20Report.pdf
    const pyramid = {
      labels: ['0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65+'],
      datasets: [
        {
          label: 'Male',
          data: [10.2, 9.8, 9.3, 8.7, 7.8, 6.9, 6.0, 5.1, 4.2, 3.3, 2.4, 1.5, 1.0],
          backgroundColor: '#3366FF',
          borderRadius: 6,
        },
        {
          label: 'Female',
          data: [10.0, 9.6, 9.1, 8.6, 7.7, 6.8, 5.9, 5.0, 4.1, 3.2, 2.3, 1.4, 1.0],
          backgroundColor: '#ff9f43',
          borderRadius: 6,
        },
      ],
      year: 2018,
    };

    res.json({ gender, pyramid });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch demographics data.', error: error.message });
  }
});

// @desc    Get health metrics data (life expectancy, infant mortality, healthcare access)
// @route   GET /api/dashboard/health-metrics
// @access  Private
router.get('/health-metrics', protect, async (req, res) => {
  try {
    // World Bank indicators for Malawi
    const indicators = [
      { code: 'SP.DYN.LE00.IN', label: 'Life Expectancy' }, // years
      { code: 'SP.DYN.IMRT.IN', label: 'Infant Mortality' }, // per 1,000 live births
      { code: 'SH.STA.BASS.ZS', label: 'Access to Basic Sanitation (%)' }, // proxy for healthcare access
    ];
    const results = await Promise.all(
      indicators.map(async (ind) => {
        const data = await fetch(`https://api.worldbank.org/v2/country/MWI/indicator/${ind.code}?format=json&per_page=20`)
          .then(r => r.json());
        // Find the most recent non-null value
        let value = null, year = null;
        if (Array.isArray(data[1])) {
          for (const entry of data[1]) {
            if (entry.value !== null) {
              value = entry.value;
              year = entry.date;
              break;
            }
          }
        }
        return { label: ind.label, value, year };
      })
    );
    // Use the most recent year among all indicators for display
    const year = results.reduce((acc, r) => (r.year && (!acc || r.year > acc)) ? r.year : acc, null);
    const healthData = {
      labels: results.map(r => r.label),
      datasets: [
        {
          label: 'Value',
          data: results.map(r => r.value),
          backgroundColor: ['#00ab55', '#ff5630', '#3366FF'],
          borderRadius: 8,
        },
      ],
      year,
    };
    res.json(healthData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch health metrics data.', error: error.message });
  }
});

// @desc    Get population growth analysis data
// @route   GET /api/dashboard/growth-analysis
// @access  Private
router.get('/growth-analysis', protect, async (req, res) => {
  try {
    // World Bank indicator for population growth rate (annual %)
    const indicator = 'SP.POP.GROW';
    const data = await fetch(`https://api.worldbank.org/v2/country/MWI/indicator/${indicator}?format=json&per_page=30`)
      .then(r => r.json());
    if (!Array.isArray(data[1])) {
      return res.status(500).json({ message: 'No growth rate data found.' });
    }
    // Get the most recent 20 years with non-null values
    const values = data[1]
      .filter(entry => entry.value !== null)
      .slice(0, 20)
      .reverse(); // oldest to newest
    const chartData = {
      labels: values.map(entry => entry.date),
      datasets: [
        {
          label: 'Population Growth Rate (%)',
          data: values.map(entry => entry.value),
          borderColor: '#00ab55',
          backgroundColor: 'rgba(0,171,85,0.15)',
          fill: true,
          tension: 0.4,
        },
      ],
      yearRange: values.length > 0 ? `${values[0].date}–${values[values.length-1].date}` : '',
    };
    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch growth analysis data.', error: error.message });
  }
});

// @desc    Get comparative studies data (Malawi, Tanzania, Mozambique population growth rate)
// @route   GET /api/dashboard/comparative-studies
// @access  Private
router.get('/comparative-studies', protect, async (req, res) => {
  try {
    const countries = [
      { code: 'MWI', label: 'Malawi', color: '#3366FF' },
      { code: 'TZA', label: 'Tanzania', color: '#00ab55' },
      { code: 'MOZ', label: 'Mozambique', color: '#ff9f43' },
    ];
    const indicator = 'SP.POP.GROW'; // Population growth (annual %)
    // Fetch data for all countries in parallel
    const results = await Promise.all(
      countries.map(async (country) => {
        const data = await fetch(`https://api.worldbank.org/v2/country/${country.code}/indicator/${indicator}?format=json&per_page=20`).then(r => r.json());
        if (!Array.isArray(data[1])) return null;
        // Get the most recent 10 years with non-null values
        const values = data[1]
          .filter(entry => entry.value !== null)
          .slice(0, 10)
          .reverse(); // oldest to newest
        return {
          label: country.label,
          data: values.map(entry => entry.value),
          backgroundColor: country.color,
          borderRadius: 8,
          years: values.map(entry => entry.date),
        };
      })
    );
    // Use the years from the first country as labels
    const labels = results[0] && results[0].years ? results[0].years : [];
    const chartData = {
      labels,
      datasets: results.filter(Boolean).map(({ years, ...rest }) => rest),
    };
    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch comparative studies data.', error: error.message });
  }
});

// @desc    Get analytics data (population trend, age distribution, regional comparison)
// @route   GET /api/dashboard/analytics
// @access  Private
router.get('/analytics', protect, async (req, res) => {
  try {
    // Fetch population trend
    const { populationTrend } = await getPopulationData();
    // Fetch age distribution (same as /api/dashboard/age-distribution)
    const indicators = [
      { code: 'SP.POP.0014.TO.ZS', label: '0-14 years' },
      { code: 'SP.POP.1564.TO.ZS', label: '15-64 years' },
      { code: 'SP.POP.65UP.TO.ZS', label: '65+ years' },
    ];
    const results = await Promise.all(
      indicators.map(ind =>
        fetch(`https://api.worldbank.org/v2/country/MWI/indicator/${ind.code}?format=json&per_page=1`)
          .then(r => r.json())
          .then(data => ({
            label: ind.label,
            value: data[1] && data[1][0] ? data[1][0].value : null,
            year: data[1] && data[1][0] ? data[1][0].date : null
          }))
      )
    );
    const year = results[0].year;
    const ageDistribution = {
      labels: results.map(r => r.label),
      datasets: [{
        data: results.map(r => r.value),
        backgroundColor: ['#367BFA', '#54D62C', '#FFC107'],
        hoverOffset: 4,
      }],
      year,
    };
    // Regional comparison (use regionalCensus2018 from above)
    const regionalComparison = regionalCensus2018;
    res.json({ populationTrend, ageDistribution, regionalComparison });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics data.', error: error.message });
  }
});

// @desc    Get urban vs rural population data
// @route   GET /api/dashboard/urban-rural
// @access  Private
router.get('/urban-rural', protect, async (req, res) => {
  try {
    // World Bank indicators for Malawi
    const urbanRes = await fetch('https://api.worldbank.org/v2/country/MWI/indicator/SP.URB.TOTL.IN.ZS?format=json&per_page=20').then(r => r.json());
    // Find the most recent non-null value for urban
    let urban = null, year = null;
    if (Array.isArray(urbanRes[1])) {
      for (const entry of urbanRes[1]) {
        if (entry.value !== null) {
          urban = entry.value;
          year = entry.date;
          break;
        }
      }
    }
    // Rural is 100 - urban
    const rural = urban !== null ? 100 - urban : null;
    const data = {
      labels: ['Urban', 'Rural'],
      datasets: [
        {
          data: [urban, rural],
          backgroundColor: ['#3366FF', '#00ab55'],
          borderRadius: 8,
        },
      ],
      year,
    };
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch urban vs rural data.', error: error.message });
  }
});

module.exports = router; 