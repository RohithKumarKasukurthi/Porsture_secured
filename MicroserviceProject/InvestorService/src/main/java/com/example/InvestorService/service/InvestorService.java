package com.example.InvestorService.service;

import com.example.InvestorService.entity.Investor;
import com.example.InvestorService.repositiory.InvestorRepositiory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InvestorService {

    @Autowired
    private InvestorRepositiory repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Investor> findAll() {
        List<Investor> list = repository.findAll();
        list.forEach(i -> i.setPassword(null));
        return list;
    }

    public Optional<Investor> findById(Long id) {
        return repository.findById(id).map(i -> {
            i.setPassword(null);
            return i;
        });
    }

    public Investor register(Investor investor) throws Exception {
        if (repository.findByEmail(investor.getEmail()).isPresent()) {
            throw new Exception("Email already in use!");
        }
        investor.setPassword(passwordEncoder.encode(investor.getPassword())); // Encrypt password
        return repository.save(investor);
    }

    public Optional<Investor> login(String email, String password) {
        return repository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()));
    }

    public Investor updateProfile(Long id, Investor data) throws Exception {
        Investor existing = repository.findById(id)
                .orElseThrow(() -> new Exception("Investor not found"));

        if (data.getFullName() != null)
            existing.setFullName(data.getFullName());
        if (data.getPhoneNumber() != null)
            existing.setPhoneNumber(data.getPhoneNumber());

        if (data.getEmail() != null && !data.getEmail().equalsIgnoreCase(existing.getEmail())) {
            if (repository.findByEmail(data.getEmail()).isPresent()) {
                throw new Exception("Email already taken");
            }
            existing.setEmail(data.getEmail());
        }

        if (data.getPassword() != null && !data.getPassword().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(data.getPassword())); // Encrypt password
        }

        return repository.save(existing);
    }

    public boolean changePassword(Long id, String oldPass, String newPass) {
        return repository.findById(id).map(user -> {
            if (passwordEncoder.matches(oldPass, user.getPassword())) {
                user.setPassword(passwordEncoder.encode(newPass)); // Encrypt new password
                repository.save(user);
                return true;
            }
            return false;
        }).orElse(false);
    }

    public Optional<Investor> findByEmail(String email) {
        return repository.findByEmail(email);
    }

    public boolean resetPassword(String email, String newPassword) {
        Optional<Investor> investorOpt = repository.findByEmail(email);
        if (investorOpt.isPresent()) {
            Investor investor = investorOpt.get();

            // Check if new password is same as old password
            if (passwordEncoder.matches(newPassword, investor.getPassword())) {
                throw new IllegalArgumentException("New password cannot be the same as your old password");
            }

            investor.setPassword(passwordEncoder.encode(newPassword)); // Encrypt new password
            repository.save(investor);
            return true;
        }
        return false;
    }
}