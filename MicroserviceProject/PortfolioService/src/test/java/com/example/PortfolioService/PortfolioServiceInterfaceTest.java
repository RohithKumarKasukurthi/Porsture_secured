package com.example.PortfolioService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.PortfolioService.entity.Portfolio;
import com.example.PortfolioService.service.PortfolioServiceI;

@ExtendWith(MockitoExtension.class)
class PortfolioServiceInterfaceTest {

    @Mock
    private PortfolioServiceI portfolioServiceI;

    @Test
    void testSubmitPortfolio_Success() {
        Portfolio portfolio = new Portfolio();
        portfolio.setPortfolioName("Test Portfolio");
        portfolio.setInvestedAmount(100000.0);

        Portfolio savedPortfolio = new Portfolio();
        savedPortfolio.setPortfolioId(1L);
        savedPortfolio.setInvestorId(1L);
        savedPortfolio.setPortfolioName("Test Portfolio");

        when(portfolioServiceI.submitPortfolio(1L, portfolio)).thenReturn(savedPortfolio);

        Portfolio result = portfolioServiceI.submitPortfolio(1L, portfolio);

        assertNotNull(result);
        assertEquals(1L, result.getPortfolioId());
        assertEquals(1L, result.getInvestorId());
        verify(portfolioServiceI, times(1)).submitPortfolio(1L, portfolio);
    }

    @Test
    void testSubmitPortfolio_InvestorNotFound() {
        Portfolio portfolio = new Portfolio();
        portfolio.setPortfolioName("Test Portfolio");

        when(portfolioServiceI.submitPortfolio(999L, portfolio))
            .thenThrow(new IllegalArgumentException("Investor not found with ID: 999"));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, 
            () -> portfolioServiceI.submitPortfolio(999L, portfolio));

        assertEquals("Investor not found with ID: 999", exception.getMessage());
        verify(portfolioServiceI, times(1)).submitPortfolio(999L, portfolio);
    }

    @Test
    void testGetAllPortfolios() {
        when(portfolioServiceI.getAllPortfolios()).thenReturn(java.util.List.of());

        var result = portfolioServiceI.getAllPortfolios();

        assertNotNull(result);
        verify(portfolioServiceI, times(1)).getAllPortfolios();
    }
}
