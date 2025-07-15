import React, { createContext, useContext, useState } from 'react';

const HistoricalContext = createContext();

export const HistoricalProvider = ({ children }) => {
  const [populationTrend, setPopulationTrend] = useState(null);
  const [explanation, setExplanation] = useState('');

  return (
    <HistoricalContext.Provider value={{ populationTrend, setPopulationTrend, explanation, setExplanation }}>
      {children}
    </HistoricalContext.Provider>
  );
};

export const useHistorical = () => useContext(HistoricalContext); 