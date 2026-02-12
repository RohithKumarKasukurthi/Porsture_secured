package com.example.ComplianceReportService.entity;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "compliance_logs")
public class ComplianceReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;        // Matches React "logId"

    @Column(name = "portfolio_id")
    private Integer portfolioId; // Matches React "portfolioId"

    @Column(name = "regulation_type")
    private String regulationType; // "SEBI" or "MiFID II"

    @Column(name = "findings", columnDefinition = "TEXT")
    private String findings;       // "Violation: ..."

    @Column(name = "compliance_status")
    private String complianceStatus; // "COMPLIANT" or "NON-COMPLIANT"

    @Column(name = "log_date")
    private LocalDate date;        // Matches React "date"

    // Default Constructor
    public ComplianceReport() {}

    // Constructor for easy creation in the Service layer
    public ComplianceReport(Integer portfolioId, String regulationType, String findings, String complianceStatus, LocalDate date) {
        this.portfolioId = portfolioId;
        this.regulationType = regulationType;
        this.findings = findings;
        this.complianceStatus = complianceStatus;
        this.date = date;
    }

    // Getters and Setters
    public Long getLogId() { return logId; }
    public void setLogId(Long logId) { this.logId = logId; }

    public Integer getPortfolioId() { return portfolioId; }
    public void setPortfolioId(Integer portfolioId) { this.portfolioId = portfolioId; }

    public String getRegulationType() { return regulationType; }
    public void setRegulationType(String regulationType) { this.regulationType = regulationType; }

    public String getFindings() { return findings; }
    public void setFindings(String findings) { this.findings = findings; }

    public String getComplianceStatus() { return complianceStatus; }
    public void setComplianceStatus(String complianceStatus) { this.complianceStatus = complianceStatus; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}