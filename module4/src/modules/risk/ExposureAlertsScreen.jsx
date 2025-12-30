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
      <Card className="exposure-alerts-card">
        <CardContent>
          <Typography variant="h6" className="exposure-alerts-title">
            Exposure & Alerts – {selectedPortfolio}
          </Typography>

          {/* 🔴 ACTIVE ALERT */}
          {activeBreaches.length > 0 && (
            <Alert
              severity="warning"
              className="exposure-alerts-alert"
              sx={{ mt: 2 }}
            >
              ▲ High Risk Alert Triggered
            </Alert>
          )}

          {/* 📊 EXPOSURE ANALYSIS */}
          <div className="exposure-alerts-section">
            <Typography
              className="exposure-alerts-section-title"
              sx={{ mt: 3 }}
            >
              Exposure Analysis
            </Typography>

            <Table sx={{ mt: 1 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Asset</TableCell>
                  <TableCell>Exposure (%)</TableCell>
                  <TableCell>Limit (%)</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exposure.map((e) => {
                  const breached = e.value > LIMITS[e.name];
                  return (
                    <TableRow
                      key={e.name}
                      sx={{
                        bgcolor: breached ? "#fff3e0" : "inherit",
                      }}
                    >
                      <TableCell>{e.name}</TableCell>
                      <TableCell
                        className={breached ? "exposure-value-breached" : ""}
                      >
                        {e.value}%
                      </TableCell>
                      <TableCell>{LIMITS[e.name]}%</TableCell>
                      <TableCell>
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
            <Typography
              className="exposure-alerts-section-title"
              sx={{ mt: 4 }}
            >
              Breach History
            </Typography>

            <Button
              className="exposure-alerts-download-button"
              sx={{ mt: 1 }}
              color="warning"
              onClick={downloadReport}
            >
              Download Breach Report
            </Button>

            <Table sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Risk ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Breaches</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {breaches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3}>No breaches recorded</TableCell>
                  </TableRow>
                ) : (
                  breaches.map((r) => (
                    <TableRow key={r.riskId}>
                      <TableCell>{r.riskId}</TableCell>
                      <TableCell>{r.evaluationDate.toLocaleString()}</TableCell>
                      <TableCell>{r.breaches.join(", ")}</TableCell>
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
