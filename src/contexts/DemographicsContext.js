import React, { createContext, useState, useEffect } from "react";

export const DemographicsContext = createContext();

export const DemographicsProvider = ({ children }) => {
  const [demographicsData, setDemographicsData] = useState(() => {
    const stored = localStorage.getItem("demographicsData");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (demographicsData) {
      localStorage.setItem("demographicsData", JSON.stringify(demographicsData));
    }
  }, [demographicsData]);

  return (
    <DemographicsContext.Provider value={{ demographicsData, setDemographicsData }}>
      {children}
    </DemographicsContext.Provider>
  );
}; 