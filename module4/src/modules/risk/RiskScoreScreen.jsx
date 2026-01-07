import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate, Link } from "react-router-dom";
import { useRisk } from "./RiskProvider";
import { calculateRiskScore, getRiskLevel, getExposureData } from "./riskUtils";
import { downloadCSV } from "./reportUtils";
import "./RiskScoreScreen.css";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

// Style object for Dark Theme Inputs
const darkInputStyle = {
    background: '#1e293b', 
    borderRadius: 1,
    "& .MuiInputBase-input": { color: "white" },
    "& .MuiInputLabel-root": { color: "#94a3b8" }, // Label Color
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#334155" }, // Border Color
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#3b82f6" },
    "& .MuiSelect-icon": { color: "white" }
};

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
          <span className="portsure-icon">📊</span>
          <span className="portsure-text">PortSure</span>
        </div>

        <div className="portsure-nav">
          <Link to="/asset-manager" style={{textDecoration:'none', color:'inherit'}}>Home</Link>
          <span>Asset Allocation</span>
          <span>Trade Status</span>
          <span>Portfolio Diversification</span>
          <span className="active">Risk Dashboard</span>
          <Link to="/" style={{textDecoration:'none', color:'inherit'}}>Logout</Link>
        </div>
      </div>

      {/* ===== MAIN LAYOUT: LEFT PANEL (INPUTS) & RIGHT PANEL (SCORE) ===== */}
      <div className="risk-score-main-layout">
        
        {/* LEFT PANEL */}
        <Card className="risk-score-card risk-score-left-panel">
            <CardContent>
                <Typography variant="h6" className="risk-score-title">
                    Risk Score Calculator
                </Typography>
                
                {/* PORTFOLIO SELECTOR */}
                <TextField
                  select
                  label="Select Portfolio ID"
                  value={selectedPortfolio}
                  onChange={(e) => setSelectedPortfolio(e.target.value)}
                  fullWidth
                  sx={{ mt: 2, ...darkInputStyle }}
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
                        sx={darkInputStyle}
                      />
                    </Grid>
                  ))}
                </Grid>
            </CardContent>
        </Card>

        {/* RIGHT PANEL */}
        <Card className="risk-score-card risk-score-right-panel">
           <CardContent style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%'}}>
              <Typography variant="h6" style={{ color:'#fff', marginBottom:'20px'}}>Current Risk Analysis</Typography>
              
              {/* RISK SCORE */}
              <Typography variant="h2" className="risk-score-display">
                {score}
              </Typography>
              
              <Chip
                label={`${level.label} Risk`}
                className={`risk-score-badge ${badgeClass}`}
                sx={{ mb: 4 }}
              />

              {/* ACTION BUTTONS */}
              <div className="risk-score-buttons" style={{ width: '100%' }}>
                <Button
                  className="risk-score-button-primary"
                  onClick={calculateRisk}
                  fullWidth
                >
                  Calculate Present Risk
                </Button>

                <Button
                  className="risk-score-button-secondary"
                  onClick={() => navigate("/exposure-alerts")}
                  fullWidth
                >
                  View Exposure & Alerts
                </Button>
              </div>
            </CardContent>
        </Card>
      </div>

      {/* ===== LOWER LAYOUT: HISTORY TABLE & CHART ===== */}
      <div className="risk-score-lower-layout">
        
        {/* RISK SCORE HISTORY */}
        <Card className="risk-score-card risk-score-history-section">
            <CardContent>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
                    <Typography
                      variant="subtitle1"
                      className="risk-score-history-title"
                    >
                      Risk Score History
                    </Typography>

                    <Button
                      className="risk-score-download-button"
                      onClick={downloadReport}
                    >
                      Download CSV
                    </Button>
                </div>

                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#94a3b8', fontWeight:'bold' }}>Risk ID</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight:'bold' }}>Score</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight:'bold' }}>Evaluation Date</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {calculationHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} sx={{ color: '#94a3b8', textAlign:'center', fontStyle:'italic' }}>
                            No risk calculations yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      calculationHistory.map((r) => (
                        <TableRow key={r.riskId}>
                          <TableCell sx={{ color: 'white' }}>{r.riskId}</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight:'bold' }}>{r.scoreValue}</TableCell>
                          <TableCell sx={{ color: 'white' }}>
                            {r.evaluationDate.toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
            </CardContent>
        </Card>

        {/* PORTFOLIO DIVERSIFICATION CHART */}
        <Card className="risk-score-card risk-score-chart-section">
            <CardContent>
                <Typography
                  variant="subtitle1"
                  className="risk-score-chart-title"
                >
                  Asset Allocation
                </Typography>

                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      stroke="none"
                      label={(entry) => `${entry.value}%`}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                        formatter={(v) => `${v}%`} 
                        contentStyle={{ backgroundColor: '#1e293b', border:'none', color:'white' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}