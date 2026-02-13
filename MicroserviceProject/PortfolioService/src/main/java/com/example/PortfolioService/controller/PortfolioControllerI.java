package com.example.PortfolioService.controller;

import com.example.PortfolioService.entity.Portfolio;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface PortfolioControllerI {

    List<Portfolio> getAllPortfolios();

    ResponseEntity<?> submitPortfolio(Long investorId, Portfolio portfolioData);

    List<Portfolio> getInvestorPortfolios(Long investorId);

    ResponseEntity<?> updateStatus(Long id, Portfolio.Status status);

    ResponseEntity<?> updatePortfolio(Long id, Portfolio updatedData);

    ResponseEntity<?> resubmitPortfolio(Long id, Portfolio updatedData);

    ResponseEntity<?> deletePortfolio(Long id);

    ResponseEntity<?> getPortfolioById(Long id);
}
