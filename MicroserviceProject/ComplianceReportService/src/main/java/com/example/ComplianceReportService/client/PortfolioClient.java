package com.example.ComplianceReportService.client;

import com.example.ComplianceReportService.dto.PortfolioDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(name = "PORTFOLIO-SERVICE")
public interface PortfolioClient {

    @GetMapping("/api/portfolios/{id}")
    PortfolioDto getPortfolioById(@PathVariable("id") Long id);

    @GetMapping("/api/portfolios/all")
    List<PortfolioDto> getAllPortfolios();

}