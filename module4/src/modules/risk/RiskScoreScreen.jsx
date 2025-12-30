import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Chip,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { useRisk } from "./RiskProvider";
import { calculateRiskScore, getRiskLevel, getExposureData } from "./riskUtils";
import { downloadCSV } from "./reportUtils";
import "./RiskScoreScreen.css";

const COLORS = ["#1976d2", "#26a69a", "#ef5350"];

export default function RiskScoreScreen() {
  const navigate = useNavigate();

  const {
    portfolios,
    selectedPortfolio,
    setSelectedPortfolio,
    allocation,
    updateAllocation,
    riskHistory,
    calculateRisk,
  } = useRisk();

  const score = calculateRiskScore(allocation);
  const level = getRiskLevel(score);
  const pieData = getExposureData(allocation);

  const calculationHistory = riskHistory.filter(
    (r) => r.type === "CALCULATION"
  );

  const downloadReport = () => {
    downloadCSV(
      `risk-score-${selectedPortfolio}.csv`,
      calculationHistory.map((r) => ({
        riskId: r.riskId,
        portfolioId: selectedPortfolio,
        scoreValue: r.scoreValue,
        evaluationDate: r.evaluationDate.toLocaleString(),
      }))
    );
  };

  const badgeClass =
    level.label === "Medium"
      ? "medium"
      : level.label === "High"
      ? "high"
      : "low";

  return (
    <div className="risk-score-container">
      {/* ===== HEADER BAR ===== */}
      <div className="portsure-header">
        <div className="portsure-logo">
          <span className="portsure-icon">▦</span>
          <span className="portsure-text">PortSure</span>
        </div>

        <div className="portsure-nav">
          <span>Home</span>
          <span>Asset Allocation</span>
          <span>Trade Status</span>
          <span>Portfolio Diversification</span>
          <span className="active">Risk Dashboard</span>
        </div>
      </div>

      <Card className="risk-score-card">
        <CardContent>
          {/* ===== HEADER ===== */}
          <Typography variant="h6" className="risk-score-title">
            Risk Score Dashboard
          </Typography>

          {/* ===== MAIN LAYOUT: LEFT PANEL (INPUTS) & RIGHT PANEL (SCORE) ===== */}
          <div className="risk-score-main-layout">
            {/* LEFT PANEL */}
            <div className="risk-score-left-panel">
              {/* PORTFOLIO SELECTOR */}
              <TextField
                select
                label="Select Portfolio ID"
                value={selectedPortfolio}
                onChange={(e) => setSelectedPortfolio(e.target.value)}
                sx={{ mt: 2, minWidth: 240 }}
              >
                {Object.keys(portfolios).map((pid) => (
                  <MenuItem key={pid} value={pid}>
                    {pid}
                  </MenuItem>
                ))}
              </TextField>

              {/* ASSET ALLOCATION */}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {Object.keys(allocation).map((asset) => (
                  <Grid item xs={12} key={asset}>
                    <TextField
                      fullWidth
                      type="number"
                      label={`${asset} Quantity`}
                      value={allocation[asset]}
                      onChange={(e) => updateAllocation(asset, e.target.value)}
                    />
                  </Grid>
                ))}
              </Grid>
            </div>

            {/* RIGHT PANEL */}
            <div className="risk-score-right-panel">
              {/* RISK SCORE */}
              <Typography variant="h2" className="risk-score-display">
                {score}
              </Typography>
              <Chip
                label={`${level.label} Risk`}
                color={level.color}
                className={`risk-score-badge ${badgeClass}`}
                sx={{ mb: 2 }}
              />

              {/* ACTION BUTTONS */}
              <div className="risk-score-buttons">
                <Button
                  variant="contained"
                  className="risk-score-button-primary"
                  onClick={calculateRisk}
                >
                  Calculate Present Risk
                </Button>

                <Button
                  variant="outlined"
                  className="risk-score-button-secondary"
                  onClick={() => navigate("/exposure-alerts")}
                >
                  View Exposure & Alerts
                </Button>
              </div>
            </div>
          </div>

          {/* ===== LOWER LAYOUT: HISTORY TABLE & CHART ===== */}
          <div className="risk-score-lower-layout">
            {/* RISK SCORE HISTORY */}
            <div className="risk-score-history-section">
              <Typography
                variant="subtitle1"
                className="risk-score-history-title"
              >
                Risk Score History
              </Typography>

              <Button
                className="risk-score-download-button"
                sx={{ mb: 1 }}
                onClick={downloadReport}
              >
                Download Risk Score Report (CSV)
              </Button>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Risk ID</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Evaluation Date</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {calculationHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3}>
                        No risk calculations yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    calculationHistory.map((r) => (
                      <TableRow key={r.riskId}>
                        <TableCell>{r.riskId}</TableCell>
                        <TableCell>{r.scoreValue}</TableCell>
                        <TableCell>
                          {r.evaluationDate.toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* PORTFOLIO DIVERSIFICATION CHART */}
            <div className="risk-score-chart-section">
              <Typography
                variant="subtitle1"
                className="risk-score-chart-title"
              >
                Asset Allocation
              </Typography>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    label={(entry) => `${entry.value}%`}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
