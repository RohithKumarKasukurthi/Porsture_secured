package com.example.ComplianceReportService.service;

import com.example.ComplianceReportService.client.PortfolioClient;
import com.example.ComplianceReportService.entity.ComplianceReport;
import com.example.ComplianceReportService.repositiory.ComplianceReportRepositiory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ComplianceService {

    @Autowired
    private ComplianceReportRepositiory logRepository;

    @Autowired
    private PortfolioClient portfolioClient;

    public List<ComplianceReport> getAllLogs() {
        return logRepository.findAll();
    }

    public String auditPortfolio(Long portfolioId) {
        PortfolioClient.PortfolioDto p;
        try {
            p = portfolioClient.getPortfolioById(portfolioId);
        } catch (Exception ex) {
            return "Error: Unable to fetch Portfolio ID " + portfolioId + " from portfolio-service. " + ex.getMessage();
        }

        if (p == null) {
            return "Error: Portfolio ID " + portfolioId + " not found.";
        }

        // Delete existing logs for this portfolio
        logRepository.deleteByPortfolioId(Math.toIntExact(portfolioId));

        double equity = p.getEquityPercentage() == null ? 0.0 : p.getEquityPercentage();
        double derivative = p.getDerivativePercentage() == null ? 0.0 : p.getDerivativePercentage();
        double bond = p.getBondPercentage() == null ? 0.0 : p.getBondPercentage();
        String regulationType = p.getRegulationType() != null ? p.getRegulationType() : "SEBI";

        String status = "COMPLIANT";
        String findings = "No compliance violations detected";

        if (derivative > bond) {
            status = "NON-COMPLIANT";
            findings = "VIOLATION: Insufficient Coverage. Bond % must cover Derivative risk.";
        } else if (derivative > 50) {
            status = "NON-COMPLIANT";
            findings = "VIOLATION: Derivative exposure exceeds the 50% regulatory cap.";
        } else if (bond < 10) {
            status = "NON-COMPLIANT";
            findings = "VIOLATION: Insufficient liquidity. Bond allocation must be at least 10%.";
        }

        ComplianceReport log = new ComplianceReport(
                Math.toIntExact(p.getPortfolioId()),
                regulationType,
                findings,
                status,
                LocalDate.now()
        );
        logRepository.save(log);

        return "Audit Completed for Portfolio ID: " + p.getPortfolioId();
    }

    public String auditAllPortfolios() {
        // This would need a method to get all portfolio IDs from PortfolioService
        // For now, manually audit portfolios 1-10
        StringBuilder result = new StringBuilder();
        for (long i = 1; i <= 10; i++) {
            try {
                auditPortfolio(i);
                result.append("Portfolio ").append(i).append(" audited. ");
            } catch (Exception e) {
                result.append("Portfolio ").append(i).append(" failed. ");
            }
        }
        return result.toString();
    }
}
