@echo off
echo Stopping all PortSure microservices...
echo.

taskkill /F /FI "WINDOWTITLE eq Eureka-8761*" 2>nul
taskkill /F /FI "WINDOWTITLE eq Gateway-8081*" 2>nul
taskkill /F /FI "WINDOWTITLE eq Investor-8302*" 2>nul
taskkill /F /FI "WINDOWTITLE eq Portfolio-8303*" 2>nul
taskkill /F /FI "WINDOWTITLE eq RiskScore-8304*" 2>nul
taskkill /F /FI "WINDOWTITLE eq ExposureAlert-8305*" 2>nul
taskkill /F /FI "WINDOWTITLE eq Compliance-8306*" 2>nul
taskkill /F /FI "WINDOWTITLE eq AdminUser-8307*" 2>nul

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8761') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8302') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8303') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8304') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8305') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8306') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8307') do taskkill /F /PID %%a 2>nul

echo All microservices and CMD windows closed.
timeout /t 2 /nobreak