import React, { createContext, useState, useEffect } from "react";

export const RegionalContext = createContext();

export const RegionalProvider = ({ children }) => {
  const [regionalData, setRegionalData] = useState(() => {
    const stored = localStorage.getItem("regionalData");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (regionalData) {
      localStorage.setItem("regionalData", JSON.stringify(regionalData));
    }
  }, [regionalData]);

  return (
    <RegionalContext.Provider value={{ regionalData, setRegionalData }}>
      {children}
    </RegionalContext.Provider>
  );
}; 