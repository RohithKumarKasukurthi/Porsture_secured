@echo off
set ROOT_DIR=%~dp0

start "Eureka-8761" cmd /k "cd /d "%ROOT_DIR%EurekaServer" && mvnw.cmd spring-boot:run"
timeout /t 30 /nobreak

start "Gateway-8081" cmd /k "cd /d "%ROOT_DIR%APIGateway" && mvnw.cmd spring-boot:run"
timeout /t 10 /nobreak

start "Investor-8302" cmd /k "cd /d "%ROOT_DIR%InvestorService" && mvnw.cmd spring-boot:run"
start "Portfolio-8303" cmd /k "cd /d "%ROOT_DIR%PortfolioService" && mvnw.cmd spring-boot:run"
start "RiskScore-8304" cmd /k "cd /d "%ROOT_DIR%RiskScoreService" && mvnw.cmd spring-boot:run"
start "ExposureAlert-8305" cmd /k "cd /d "%ROOT_DIR%ExposureAlertService" && mvnw.cmd spring-boot:run"
start "Compliance-8306" cmd /k "cd /d "%ROOT_DIR%ComplianceReportService" && mvnw.cmd spring-boot:run"
start "AdminUser-8307" cmd /k "cd /d "%ROOT_DIR%AdminUserService" && mvnw.cmd spring-boot:run"

echo All services starting! Check Eureka: http://localhost:8761