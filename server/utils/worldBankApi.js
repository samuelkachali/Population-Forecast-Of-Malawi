const axios = require('axios');

const countryCode = 'MW'; // Malawi

const fetchWorldBankData = async (indicator) => {
    const url = `http://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?format=json&date=2018:2023`;
    try {
        const response = await axios.get(url);
        // Data is in the second element of the array
        if (response.data && response.data[1]) {
            return response.data[1].sort((a, b) => a.date.localeCompare(b.date)); // Sort by date ascending
        }
        return [];
    } catch (error) {
        console.error(`Error fetching World Bank data for ${indicator}:`, error.message);
        throw new Error('Failed to fetch data from World Bank API.');
    }
};

const getPopulationData = async () => {
    const populationData = await fetchWorldBankData('SP.POP.TOTL');

    if (populationData.length < 2) {
        throw new Error('Not enough population data to generate trends.');
    }

    // Find the latest year in the data
    const latestYearEntry = populationData[populationData.length - 1];
    const previousYearEntry = populationData[populationData.length - 2];
    const latestPop = latestYearEntry.value;
    const previousPop = previousYearEntry.value;
    const latestYear = latestYearEntry.date;
    const previousYear = previousYearEntry.date;
    const nextYear = (parseInt(latestYear) + 1).toString();

    // --- Stats ---
    const growthRate = ((latestPop - previousPop) / previousPop) * 100;
    const latestGrowth = growthRate - 2.4; // Dummy change for display
    const nextYearProjection = latestPop * (1 + growthRate / 100);

    const stats = {
        totalPopulation: { 
            label: 'Total Population', 
            value: `${(latestPop / 1_000_000).toFixed(1)}M`, 
            change: `${growthRate.toFixed(1)}%`,
            icon: 'PeopleIcon', 
            color: '#54D62C',
            year: latestYear
        },
        growthRate: { 
            label: 'Growth Rate', 
            value: `${growthRate.toFixed(1)}%`, 
            change: `${latestGrowth.toFixed(1)}%`, 
            icon: 'TimelineIcon', 
            color: '#FFC107',
            year: latestYear
        },
        population2025: { 
            label: 'Next Year Projection', 
            value: `${(nextYearProjection / 1_000_000).toFixed(1)}M`, 
            change: `+${((nextYearProjection - latestPop) / 1_000_000).toFixed(1)}M`,
            icon: 'TrendingUpIcon', 
            color: '#00B8D9',
            year: nextYear
        }
    };

    // --- Population Trend Chart ---
    const populationTrend = {
        labels: populationData.map(d => d.date),
        datasets: [{
            label: 'Population (in Millions)',
            data: populationData.map(d => (d.value / 1_000_000).toFixed(2)),
            borderColor: '#367BFA',
            backgroundColor: 'rgba(54, 123, 250, 0.1)',
            fill: true,
            tension: 0.4,
        }],
    };

    return { stats, populationTrend };
};

module.exports = { getPopulationData }; 