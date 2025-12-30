import { Routes, Route, Navigate } from "react-router-dom";
import RiskProvider from "../modules/risk/RiskProvider";
import RiskScoreScreen from "../modules/risk/RiskScoreScreen";
import ExposureAlertsScreen from "../modules/risk/ExposureAlertsScreen";
 
export default function RiskRoutes() {
  return (
    <RiskProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/risk-score" />} />
        <Route path="/risk-score" element={<RiskScoreScreen />} />
        <Route path="/exposure-alerts" element={<ExposureAlertsScreen />} />
      </Routes>
    </RiskProvider>
  );
}
 