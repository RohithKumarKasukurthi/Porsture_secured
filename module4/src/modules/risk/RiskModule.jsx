import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Card,
  CardContent,
  MenuItem,
  Divider,
} from "@mui/material";
import RiskScoreScreen from "./RiskScoreScreen";
import ExposureAlertsScreen from "./ExposureAlertsScreen";
import {
  calculateRiskScore,
  evaluateBreaches,
} from "./riskUtils";
 
export default function RiskModule() {
  const [portfolios, setPortfolios] = useState({
    P1001: {
      allocation: { Equity: 60, Bond: 20, Derivative: 20 },
      riskHistory: [],
    },
    P1002: {
      allocation: { Equity: 30, Bond: 50, Derivative: 20 },
      riskHistory: [],
    },
  });
 
  const [selectedPortfolio, setSelectedPortfolio] = useState("P1001");
 
  const allocation = portfolios[selectedPortfolio].allocation;
  const riskHistory = portfolios[selectedPortfolio].riskHistory;
 
  const updateAllocation = (key, value) => {
    setPortfolios((prev) => ({
      ...prev,
      [selectedPortfolio]: {
        ...prev[selectedPortfolio],
        allocation: {
          ...prev[selectedPortfolio].allocation,
          [key]: Number(value),
        },
      },
    }));
  };
 
  /**
   * 🔁 CONTINUOUS BREACH MONITORING
   * Logs breach instantly into history
   */
  useEffect(() => {
    const breaches = evaluateBreaches(allocation);
 
    if (breaches.length > 0) {
      const lastEntry = riskHistory[0];
 
      // avoid duplicate consecutive breach logs
      if (
        !lastEntry ||
        lastEntry.type !== "BREACH" ||
        JSON.stringify(lastEntry.breaches) !== JSON.stringify(breaches)
      ) {
        const breachEntry = {
          riskId: `RISK-${Date.now()}`,
          portfolioId: selectedPortfolio,
          scoreValue: null,
          evaluationDate: new Date(),
          breaches,
          type: "BREACH",
        };
 
        setPortfolios((prev) => ({
          ...prev,
          [selectedPortfolio]: {
            ...prev[selectedPortfolio],
            riskHistory: [breachEntry, ...prev[selectedPortfolio].riskHistory],
          },
        }));
      }
    }
  }, [allocation, selectedPortfolio]);
 
  /**
   * 🔘 MANUAL RISK CALCULATION
   */
  const calculateRisk = () => {
    const score = calculateRiskScore(allocation);
    const breaches = evaluateBreaches(allocation);
 
    const riskEntry = {
      riskId: `RISK-${Date.now()}`,
      portfolioId: selectedPortfolio,
      scoreValue: score,
      evaluationDate: new Date(),
      breaches,
      type: "CALCULATION",
    };
 
    setPortfolios((prev) => ({
      ...prev,
      [selectedPortfolio]: {
        ...prev[selectedPortfolio],
        riskHistory: [riskEntry, ...prev[selectedPortfolio].riskHistory],
      },
    }));
  };
 
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5">
        Module 4.3 – Risk Scoring & Exposure Analysis
      </Typography>
 
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Select Portfolio ID"
                value={selectedPortfolio}
                onChange={(e) => setSelectedPortfolio(e.target.value)}
              >
                {Object.keys(portfolios).map((pid) => (
                  <MenuItem key={pid} value={pid}>
                    {pid}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
 
          <Typography sx={{ mt: 3 }}>
            Asset Allocation (Dummy Data)
          </Typography>
 
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {Object.keys(allocation).map((key) => (
              <Grid item xs={12} md={4} key={key}>
                <TextField
                  fullWidth
                  type="number"
                  label={`${key} Quantity`}
                  value={allocation[key]}
                  onChange={(e) =>
                    updateAllocation(key, e.target.value)
                  }
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
 
      <Divider sx={{ my: 4 }} />
 
      <RiskScoreScreen
        portfolioId={selectedPortfolio}
        allocation={allocation}
        riskHistory={riskHistory}
        onCalculate={calculateRisk}
      />
 
      <ExposureAlertsScreen allocation={allocation} />
    </Container>
  );
}
 