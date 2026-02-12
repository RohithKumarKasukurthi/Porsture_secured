package com.example.ComplianceReportService.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ComplianceReportService.entity.ComplianceReport;
import com.example.ComplianceReportService.repositiory.ComplianceReportRepositiory;
import com.example.ComplianceReportService.service.ComplianceService;

@RestController
@RequestMapping("/api/compliance")
public class ComplianceReportController {

    @Autowired
    private ComplianceReportRepositiory logRepository;

    @Autowired
    private ComplianceService service;


    @PostMapping("/audit/{portfolioId}")
    public String triggerAudit(@PathVariable Long portfolioId) {
        return service.auditPortfolio(portfolioId);
    }

    @PostMapping("/audit-all")
    public String auditAllPortfolios() {
        return service.auditAllPortfolios();
    }

    @GetMapping("/logs")
    public List<ComplianceReport> getAllLogs() {
        return service.getAllLogs();
    }

    @DeleteMapping("/logs/{logId}")
    public ResponseEntity<?> deleteLog(@PathVariable Long logId) {
        return logRepository.findById(logId)
                .map(log -> {
                    logRepository.delete(log);
                    return ResponseEntity.ok().body("Log with ID " + logId + " deleted successfully.");
                })
                .orElse(ResponseEntity.notFound().build());
    }
}