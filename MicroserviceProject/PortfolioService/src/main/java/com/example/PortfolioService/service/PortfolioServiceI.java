package com.example.PortfolioService.service;

import com.example.PortfolioService.entity.Portfolio;

import java.util.List;
import java.util.Optional;

public interface PortfolioServiceI {

    List<Portfolio> getAllPortfolios();

    Portfolio submitPortfolio(Long investorId, Portfolio portfolioData);

    List<Portfolio> getInvestorPortfolios(Long investorId);

    Optional<Portfolio> updateStatus(Long id, Portfolio.Status status);

    Optional<Portfolio> updatePortfolio(Long id, Portfolio updatedData);

    Optional<Portfolio> resubmitPortfolio(Long id, Portfolio updatedData);

    boolean deletePortfolio(Long id);

    Optional<Portfolio> getPortfolioById(Long id);
}
