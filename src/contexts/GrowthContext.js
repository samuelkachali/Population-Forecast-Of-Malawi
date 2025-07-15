import React, { createContext, useContext, useState, useEffect } from 'react';

const GrowthContext = createContext();
const GROWTH_DATA_KEY = 'growthData';
const GROWTH_EXPLANATION_KEY = 'growthExplanation';

export const GrowthProvider = ({ children }) => {
  const [growthData, setGrowthData] = useState(() => {
    const stored = localStorage.getItem(GROWTH_DATA_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [explanation, setExplanation] = useState(() => {
    return localStorage.getItem(GROWTH_EXPLANATION_KEY) || '';
  });

  useEffect(() => {
    if (growthData) {
      localStorage.setItem(GROWTH_DATA_KEY, JSON.stringify(growthData));
    }
  }, [growthData]);

  useEffect(() => {
    if (explanation) {
      localStorage.setItem(GROWTH_EXPLANATION_KEY, explanation);
    }
  }, [explanation]);

  return (
    <GrowthContext.Provider value={{ growthData, setGrowthData, explanation, setExplanation }}>
      {children}
    </GrowthContext.Provider>
  );
};

export const useGrowth = () => useContext(GrowthContext); 