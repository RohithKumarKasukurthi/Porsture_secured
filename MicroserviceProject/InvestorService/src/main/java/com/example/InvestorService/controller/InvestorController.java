package com.example.InvestorService.controller;

import com.example.InvestorService.entity.Investor;
import com.example.InvestorService.service.InvestorService;
import com.example.InvestorService.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/investors")
public class InvestorController {

    @Autowired
    private InvestorService service;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/getAllInvestors")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Investor investor) {
        try {
            return ResponseEntity.ok(service.register(investor));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Investor loginData) {
        Optional<Investor> userOpt = service.login(loginData.getEmail(), loginData.getPassword());

        if (userOpt.isPresent()) {
            Investor user = userOpt.get();
            user.setPassword(null);
            String token = jwtUtil.generateToken(user.getEmail(), "INVESTOR");
            return ResponseEntity.ok(Map.of("token", token, "user", user));
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Investor data) {
        try {
            Investor updated = service.updateProfile(id, data);
            updated.setPassword(null);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PutMapping("/update-password/{id}")
    public ResponseEntity<?> updatePassword(@PathVariable Long id, @RequestBody Map<String, String> body) {
        boolean success = service.changePassword(id, body.get("password"), body.get("fullName"));
        if (success)
            return ResponseEntity.ok("Password changed");
        return ResponseEntity.status(401).body("Verification failed");
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        Optional<Investor> investor = service.findByEmail(email);
        if (investor.isPresent()) {
            return ResponseEntity.ok("Email exists");
        }
        return ResponseEntity.status(404).body("Email not found");
    }

    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String newPassword = body.get("newPassword");

        try {
            boolean success = service.resetPassword(email, newPassword);
            if (success) {
                return ResponseEntity.ok("Password reset successfully");
            }
            return ResponseEntity.status(404).body("Email not found");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error resetting password: " + e.getMessage());
        }
    }
}