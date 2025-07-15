import React, { createContext, useContext, useState } from 'react';

const GrowthContext = createContext();

export const GrowthProvider = ({ children }) => {
  const [growthData, setGrowthData] = useState(null);
  const [explanation, setExplanation] = useState('');

  return (
    <GrowthContext.Provider value={{ growthData, setGrowthData, explanation, setExplanation }}>
      {children}
    </GrowthContext.Provider>
  );
};

export const useGrowth = () => useContext(GrowthContext); 