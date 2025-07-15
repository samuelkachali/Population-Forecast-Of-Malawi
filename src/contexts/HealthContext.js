import React, { createContext, useContext, useState, useEffect } from 'react';

const HealthContext = createContext();
const HEALTH_DATA_KEY = 'healthData';
const HEALTH_EXPLANATION_KEY = 'healthExplanation';

export const HealthProvider = ({ children }) => {
  const [healthData, setHealthData] = useState(() => {
    const stored = localStorage.getItem(HEALTH_DATA_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [explanation, setExplanation] = useState(() => {
    return localStorage.getItem(HEALTH_EXPLANATION_KEY) || '';
  });

  useEffect(() => {
    if (healthData) {
      localStorage.setItem(HEALTH_DATA_KEY, JSON.stringify(healthData));
    }
  }, [healthData]);

  useEffect(() => {
    if (explanation) {
      localStorage.setItem(HEALTH_EXPLANATION_KEY, explanation);
    }
  }, [explanation]);

  return (
    <HealthContext.Provider value={{ healthData, setHealthData, explanation, setExplanation }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => useContext(HealthContext); 