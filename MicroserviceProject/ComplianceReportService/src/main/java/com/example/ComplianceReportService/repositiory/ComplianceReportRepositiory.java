package com.example.ComplianceReportService.repositiory;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.ComplianceReportService.entity.ComplianceReport;
import java.util.Optional;

public interface ComplianceReportRepositiory extends JpaRepository<ComplianceReport, Long> {

    // Finds existing report by portfolio ID so we can update it instead of deleting
    Optional<ComplianceReport> findByPortfolioId(Integer portfolioId);
}