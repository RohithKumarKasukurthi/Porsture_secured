package com.example.ComplianceReportService.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.ComplianceReportService.entity.ComplianceReport;
import com.example.ComplianceReportService.repositiory.ComplianceReportRepositiory;
import com.example.ComplianceReportService.service.ComplianceService;

@RestController
@RequestMapping("/api/compliance")
public class ComplianceReportController {

    @Autowired
    private ComplianceService service;

    @Autowired
    private ComplianceReportRepositiory logRepository;

    @PostMapping("/audit-all")
    public ResponseEntity<List<ComplianceReport>> auditAllPortfolios() {
        try {
            List<ComplianceReport> updatedLogs = service.auditAllPortfolios();
            return ResponseEntity.ok(updatedLogs);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/logs")
    public List<ComplianceReport> getAllLogs() {
        return service.getAllLogs();
    }

    @PostMapping("/logs/create")
    public ResponseEntity<ComplianceReport> createLog(@RequestBody ComplianceReport log) {
        try {
            ComplianceReport createdLog = service.createLog(log);
            return ResponseEntity.ok(createdLog);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/logs/{logId}")
    public ResponseEntity<String> deleteLog(@PathVariable Long logId) {
        if (logRepository.existsById(logId)) {
            logRepository.deleteById(logId);
            return ResponseEntity.ok("Log deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
}