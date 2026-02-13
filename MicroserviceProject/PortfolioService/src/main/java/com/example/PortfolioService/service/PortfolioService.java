package com.example.PortfolioService.service;

import com.example.PortfolioService.client.InvestorClient;
import com.example.PortfolioService.entity.Portfolio;
import com.example.PortfolioService.repositiory.PortfolioRepositiory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioRepositiory portfolioRepository;

    @Autowired
    private InvestorClient investorClient;

    public List<Portfolio> getAllPortfolios() {
        return portfolioRepository.findAll();
    }

    public Portfolio submitPortfolio(Long investorId, Portfolio portfolioData) {
        InvestorClient.InvestorDto investor = investorClient.getInvestorById(investorId);
        
        if (investor == null || investor.getInvestorId() == null) {
            throw new IllegalArgumentException("Investor not found with ID: " + investorId);
        }

        portfolioData.setInvestorId(investorId);
        portfolioData.setStatus(Portfolio.Status.Pending);
        portfolioData.setRequestDate(LocalDate.now());

        return portfolioRepository.save(portfolioData);
    }

    public List<Portfolio> getInvestorPortfolios(Long investorId) {
        return portfolioRepository.findByInvestorId(investorId);
    }

    public Optional<Portfolio> updateStatus(Long id, Portfolio.Status status) {
        return portfolioRepository.findById(id).map(existing -> {
            existing.setStatus(status);
            return portfolioRepository.save(existing);
        });
    }

    public Optional<Portfolio> updatePortfolio(Long id, Portfolio updatedData) {
        return portfolioRepository.findById(id).map(existing -> {
            existing.setPortfolioName(updatedData.getPortfolioName());
            existing.setInvestedAmount(updatedData.getInvestedAmount());
            existing.setRegulationType(updatedData.getRegulationType());
            existing.setEquityPercentage(updatedData.getEquityPercentage());
            existing.setBondPercentage(updatedData.getBondPercentage());
            existing.setDerivativePercentage(updatedData.getDerivativePercentage());
            existing.setQuantity(updatedData.getQuantity());
            existing.setStatus(Portfolio.Status.Approved);

            return portfolioRepository.save(existing);
        });
    }

    public Optional<Portfolio> resubmitPortfolio(Long id, Portfolio updatedData) {
        return portfolioRepository.findById(id).map(existing -> {
            existing.setPortfolioName(updatedData.getPortfolioName());
            existing.setInvestedAmount(updatedData.getInvestedAmount());
            existing.setRegulationType(updatedData.getRegulationType());
            existing.setStatus(Portfolio.Status.Pending);
            existing.setRequestDate(LocalDate.now());

            return portfolioRepository.save(existing);
        });
    }

    public boolean deletePortfolio(Long id) {
        if (portfolioRepository.existsById(id)) {
            portfolioRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<Portfolio> getPortfolioById(Long id) {
        return portfolioRepository.findById(id);
    }
}
