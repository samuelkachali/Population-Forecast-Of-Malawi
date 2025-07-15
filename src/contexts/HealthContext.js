import React, { createContext, useContext, useState } from 'react';

const HealthContext = createContext();

export const HealthProvider = ({ children }) => {
  const [healthData, setHealthData] = useState(null);
  const [explanation, setExplanation] = useState('');

  return (
    <HealthContext.Provider value={{ healthData, setHealthData, explanation, setExplanation }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => useContext(HealthContext); 