package com.example.ComplianceReportService.repositiory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import com.example.ComplianceReportService.entity.ComplianceReport;

public interface ComplianceReportRepositiory extends JpaRepository<ComplianceReport, Long> {
    @Transactional
    void deleteByPortfolioId(Integer portfolioId);
}