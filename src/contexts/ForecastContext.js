import React, { createContext, useContext, useState } from 'react';

const ForecastContext = createContext();

export const ForecastProvider = ({ children }) => {
  const [regressors, setRegressors] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [regressorsChartImage, setRegressorsChartImage] = useState(null);
  const [populationChartImage, setPopulationChartImage] = useState(null);

  return (
    <ForecastContext.Provider value={{ regressors, setRegressors, predictions, setPredictions, regressorsChartImage, setRegressorsChartImage, populationChartImage, setPopulationChartImage }}>
      {children}
    </ForecastContext.Provider>
  );
};

export const useForecast = () => useContext(ForecastContext); 