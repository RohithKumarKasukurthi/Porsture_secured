import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import {
  evaluateBreaches,
  calculateRiskScore,
} from "./riskUtils";
 
const RiskContext = createContext();
 
export const useRisk = () => useContext(RiskContext);
 
export default function RiskProvider({ children }) {
  const [portfolios, setPortfolios] = useState({
    P1001: {
      allocation: { Equity: 60, Bond: 20, Derivative: 20 },
      riskHistory: [],
    },
    P1002: {
      allocation: { Equity: 3000, Bond: 50, Derivative: 19 },
      riskHistory: [],
    },
  });
 
  const [selectedPortfolio, setSelectedPortfolio] =
    useState("P1001");
 
  const allocation =
    portfolios[selectedPortfolio].allocation;
 
  const riskHistory =
    portfolios[selectedPortfolio].riskHistory;
 
  // -----------------------------
  // Update Asset Allocation
  // -----------------------------
  const updateAllocation = (asset, value) => {
    setPortfolios((prev) => ({
      ...prev,
      [selectedPortfolio]: {
        ...prev[selectedPortfolio],
        allocation: {
          ...prev[selectedPortfolio].allocation,
          [asset]: Number(value),
        },
      },
    }));
  };
 
  // -----------------------------
  // 🔴 REAL-TIME BREACH MONITORING
  // -----------------------------
  useEffect(() => {
    const breaches = evaluateBreaches(allocation);
 
    if (!breaches.length) return;
 
    const lastEvent = riskHistory[0];
 
    // Prevent duplicate identical breach entries
    if (
      lastEvent?.type === "BREACH" &&
      JSON.stringify(lastEvent.breaches) ===
        JSON.stringify(breaches)
    ) {
      return;
    }
 
    const breachEvent = {
      riskId: `RISK-${Date.now()}`,
      type: "BREACH",
      scoreValue: null,
      breaches,
      evaluationDate: new Date(),
    };
 
    setPortfolios((prev) => ({
      ...prev,
      [selectedPortfolio]: {
        ...prev[selectedPortfolio],
        riskHistory: [
          breachEvent,
          ...prev[selectedPortfolio].riskHistory,
        ],
      },
    }));
  }, [allocation, selectedPortfolio]);
 
  // -----------------------------
  // 🟦 MANUAL RISK CALCULATION
  // -----------------------------
  const calculateRisk = () => {
    const score = calculateRiskScore(allocation);
    const breaches = evaluateBreaches(allocation);
 
    const calculationEvent = {
      riskId: `RISK-${Date.now()}`,
      type: "CALCULATION",
      scoreValue: score,
      breaches,
      evaluationDate: new Date(),
    };
 
    setPortfolios((prev) => ({
      ...prev,
      [selectedPortfolio]: {
        ...prev[selectedPortfolio],
        riskHistory: [
          calculationEvent,
          ...prev[selectedPortfolio].riskHistory,
        ],
      },
    }));
  };
 
  // -----------------------------
  // CONTEXT VALUE
  // -----------------------------
  return (
    <RiskContext.Provider
      value={{
        portfolios,
        selectedPortfolio,
        setSelectedPortfolio,
        allocation,
        updateAllocation,
        riskHistory,
        calculateRisk,
      }}
    >
      {children}
    </RiskContext.Provider>
  );
}
 