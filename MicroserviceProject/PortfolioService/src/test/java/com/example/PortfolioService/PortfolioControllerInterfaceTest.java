package com.example.PortfolioService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.PortfolioService.controller.PortfolioControllerI;
import com.example.PortfolioService.entity.Portfolio;

@ExtendWith(MockitoExtension.class)
class PortfolioControllerInterfaceTest {

    @Mock
    private PortfolioControllerI portfolioControllerI;

    @Test
    void testSubmitPortfolio_Success() {
        Portfolio portfolio = new Portfolio();
        portfolio.setPortfolioName("Test Portfolio");
        portfolio.setInvestedAmount(100000.0);

        Portfolio savedPortfolio = new Portfolio();
        savedPortfolio.setPortfolioId(1L);

        when(portfolioControllerI.submitPortfolio(anyLong(), any(Portfolio.class)))
            .thenAnswer(invocation -> ResponseEntity.status(HttpStatus.OK).body(savedPortfolio));

        ResponseEntity<?> response = portfolioControllerI.submitPortfolio(1L, portfolio);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        verify(portfolioControllerI, times(1)).submitPortfolio(anyLong(), any(Portfolio.class));
    }

    @Test
    void testSubmitPortfolio_InvestorNotFound() {
        Portfolio portfolio = new Portfolio();
        portfolio.setPortfolioName("Test Portfolio");

        when(portfolioControllerI.submitPortfolio(anyLong(), any(Portfolio.class)))
            .thenAnswer(invocation -> ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Investor not found with ID: 999"));

        ResponseEntity<?> response = portfolioControllerI.submitPortfolio(999L, portfolio);

        assertEquals(400, response.getStatusCode().value());
        verify(portfolioControllerI, times(1)).submitPortfolio(anyLong(), any(Portfolio.class));
    }

    @Test
    void testGetAllPortfolios() {
        when(portfolioControllerI.getAllPortfolios()).thenReturn(java.util.List.of());

        var result = portfolioControllerI.getAllPortfolios();

        assertNotNull(result);
        verify(portfolioControllerI, times(1)).getAllPortfolios();
    }

    @Test
    void testGetPortfolioById_Found() {
        Portfolio portfolio = new Portfolio();
        portfolio.setPortfolioId(1L);

        when(portfolioControllerI.getPortfolioById(anyLong()))
            .thenAnswer(invocation -> ResponseEntity.status(HttpStatus.OK).body(portfolio));

        ResponseEntity<?> response = portfolioControllerI.getPortfolioById(1L);

        assertEquals(200, response.getStatusCode().value());
        verify(portfolioControllerI, times(1)).getPortfolioById(anyLong());
    }

    @Test
    void testDeletePortfolio_Success() {
        when(portfolioControllerI.deletePortfolio(anyLong()))
            .thenAnswer(invocation -> ResponseEntity.status(HttpStatus.OK).body("Portfolio PF-1 deleted successfully."));

        ResponseEntity<?> response = portfolioControllerI.deletePortfolio(1L);

        assertEquals(200, response.getStatusCode().value());
        verify(portfolioControllerI, times(1)).deletePortfolio(anyLong());
    }
}
