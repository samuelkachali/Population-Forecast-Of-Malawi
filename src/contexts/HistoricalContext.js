import React, { createContext, useContext, useState, useEffect } from 'react';

const HistoricalContext = createContext();
const HISTORICAL_DATA_KEY = 'historicalTrend';
const HISTORICAL_EXPLANATION_KEY = 'historicalExplanation';

export const HistoricalProvider = ({ children }) => {
  const [populationTrend, setPopulationTrend] = useState(() => {
    const stored = localStorage.getItem(HISTORICAL_DATA_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [explanation, setExplanation] = useState(() => {
    return localStorage.getItem(HISTORICAL_EXPLANATION_KEY) || '';
  });

  useEffect(() => {
    if (populationTrend) {
      localStorage.setItem(HISTORICAL_DATA_KEY, JSON.stringify(populationTrend));
    }
  }, [populationTrend]);

  useEffect(() => {
    if (explanation) {
      localStorage.setItem(HISTORICAL_EXPLANATION_KEY, explanation);
    }
  }, [explanation]);

  return (
    <HistoricalContext.Provider value={{ populationTrend, setPopulationTrend, explanation, setExplanation }}>
      {children}
    </HistoricalContext.Provider>
  );
};

export const useHistorical = () => useContext(HistoricalContext); 