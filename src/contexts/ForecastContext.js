import React, { createContext, useContext, useState, useEffect } from 'react';

const ForecastContext = createContext();
const REGRESSORS_KEY = 'forecastRegressors';
const PREDICTIONS_KEY = 'forecastPredictions';
const REGRESSORS_CHART_KEY = 'forecastRegressorsChartImage';
const POPULATION_CHART_KEY = 'forecastPopulationChartImage';

export const ForecastProvider = ({ children }) => {
  const [regressors, setRegressors] = useState(() => {
    const stored = localStorage.getItem(REGRESSORS_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [predictions, setPredictions] = useState(() => {
    const stored = localStorage.getItem(PREDICTIONS_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [regressorsChartImage, setRegressorsChartImage] = useState(() => {
    return localStorage.getItem(REGRESSORS_CHART_KEY) || null;
  });
  const [populationChartImage, setPopulationChartImage] = useState(() => {
    return localStorage.getItem(POPULATION_CHART_KEY) || null;
  });

  useEffect(() => {
    if (regressors) {
      localStorage.setItem(REGRESSORS_KEY, JSON.stringify(regressors));
    }
  }, [regressors]);

  useEffect(() => {
    if (predictions) {
      localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(predictions));
    }
  }, [predictions]);

  useEffect(() => {
    if (regressorsChartImage) {
      localStorage.setItem(REGRESSORS_CHART_KEY, regressorsChartImage);
    }
  }, [regressorsChartImage]);

  useEffect(() => {
    if (populationChartImage) {
      localStorage.setItem(POPULATION_CHART_KEY, populationChartImage);
    }
  }, [populationChartImage]);

  return (
    <ForecastContext.Provider value={{ regressors, setRegressors, predictions, setPredictions, regressorsChartImage, setRegressorsChartImage, populationChartImage, setPopulationChartImage }}>
      {children}
    </ForecastContext.Provider>
  );
};

export const useForecast = () => useContext(ForecastContext); 