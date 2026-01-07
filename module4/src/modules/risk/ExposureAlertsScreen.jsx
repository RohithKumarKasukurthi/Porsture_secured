import {
  Card,
  CardContent,
  Typography,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useRisk } from "./RiskProvider";
import { getExposureData } from "./riskUtils";
import { downloadCSV } from "./reportUtils";
import "./ExposureAlertsScreen.css";

const LIMITS = {
  Equity: 60,
  Bond: 70,
  Derivative: 30,
};

export default function ExposureAlertsScreen() {
  const { selectedPortfolio, allocation, riskHistory } = useRisk();

  const exposure = getExposureData(allocation);
  const breaches = riskHistory.filter((r) => r.type === "BREACH");

  const activeBreaches = exposure.filter((e) => e.value > LIMITS[e.name]);

  const downloadReport = () => {
    downloadCSV(
      `breach-report-${selectedPortfolio}.csv`,
      breaches.map((r) => ({
        riskId: r.riskId,
        portfolioId: selectedPortfolio,
        breaches: r.breaches.join(", "),
        date: r.evaluationDate.toLocaleString(),
      }))
    );
  };

  return (
    <div className="exposure-alerts-container">
      
      {/* ===== ADDED HEADER BAR ===== */}
      <div className="portsure-header">
        <div className="portsure-logo">
          <span className="portsure-icon">📊</span>
          <span className="portsure-text">PortSure</span>
        </div>

        <div className="portsure-nav">
          <Link to="/asset-manager">Home</Link>
          <span>Asset Allocation</span>
          <span>Trade Status</span>
          <span>Portfolio Diversification</span>
          <span className="active">Risk Dashboard</span>
          <Link to="/">LogOut</Link>
        </div>
      </div>

      {/* Back Link */}
      <div style={{ marginBottom: '20px' }}>
         <Link to="/risk-dashboard" style={{ textDecoration: 'none', color: '#3b82f6', fontWeight: 'bold' }}>
            ← Back to Dashboard
         </Link>
      </div>

      <Card className="exposure-alerts-card" sx={{ bgcolor: '#0f172a', color: 'white', borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h6" className="exposure-alerts-title" sx={{ color: 'white', textAlign: 'center', mb: 3 }}>
            Exposure & Alerts – {selectedPortfolio}
          </Typography>

          {/* 🔴 ACTIVE ALERT */}
          {activeBreaches.length > 0 && (
            <Alert
              severity="error"
              className="exposure-alerts-alert"
              sx={{ 
                mt: 2, 
                bgcolor: '#7f1d1d', 
                color: '#fca5a5', 
                '& .MuiAlert-icon': { color: '#fca5a5' },
                border: '1px solid #ef4444'
              }}
            >
              ▲ High Risk Alert Triggered
            </Alert>
          )}

          {/* 📊 EXPOSURE ANALYSIS */}
          <div className="exposure-alerts-section">
            <Typography
              className="exposure-alerts-section-title"
              sx={{ mt: 3, color: '#fff', fontWeight: 'bold' }}
            >
              Exposure Analysis
            </Typography>

            <Table sx={{ mt: 1 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#94a3b8', fontWeight:'bold' }}>Asset</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight:'bold' }}>Exposure (%)</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight:'bold' }}>Limit (%)</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight:'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exposure.map((e) => {
                  const breached = e.value > LIMITS[e.name];
                  return (
                    <TableRow
                      key={e.name}
                      sx={{
                        bgcolor: breached ? "rgba(239, 68, 68, 0.1)" : "transparent",
                      }}
                    >
                      <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{e.name}</TableCell>
                      <TableCell
                        className={breached ? "exposure-value-breached" : ""}
                        sx={{ 
                            color: breached ? '#ef4444' : '#fff', 
                            fontWeight: breached ? 'bold' : 'normal',
                            borderBottom: '1px solid rgba(255,255,255,0.1)'
                        }}
                      >
                        {e.value}%
                      </TableCell>
                      <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{LIMITS[e.name]}%</TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <span
                          className={`exposure-alerts-status-badge ${
                            breached ? "breach" : "ok"
                          }`}
                        >
                          {breached ? "BREACH" : "OK"}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* 📜 BREACH HISTORY */}
          <div className="exposure-alerts-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' }}>
                <Typography
                  className="exposure-alerts-section-title"
                  sx={{ color: '#fff', fontWeight: 'bold' }}
                >
                  Breach History
                </Typography>

                <Button
                  className="exposure-alerts-download-button"
                  sx={{ mt: 1, bgcolor: '#f59e0b', color: '#000', '&:hover': { bgcolor: '#d97706' } }}
                  onClick={downloadReport}
                >
                  Download Breach Report
                </Button>
            </div>

            <Table sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#94a3b8', fontWeight:'bold' }}>Risk ID</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight:'bold' }}>Date</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight:'bold' }}>Breaches</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {breaches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ color: '#64748b', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        No breaches recorded
                    </TableCell>
                  </TableRow>
                ) : (
                  breaches.map((r) => (
                    <TableRow key={r.riskId}>
                      <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{r.riskId}</TableCell>
                      <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{r.evaluationDate.toLocaleString()}</TableCell>
                      <TableCell sx={{ color: '#fca5a5', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{r.breaches.join(", ")}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}