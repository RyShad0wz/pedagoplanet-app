package com.cda.pedagoplanet.service;

import com.cda.pedagoplanet.entity.User;
import com.cda.pedagoplanet.exception.UserNotFoundException;
import com.cda.pedagoplanet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private EntityManager entityManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) throws UserNotFoundException {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            throw new UserNotFoundException("User not found with id : " + id);
        }
        return user;
    }
    @Transactional
    public User createUser(User user) {
        entityManager.clear();
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null) {
            throw new DataIntegrityViolationException("User with email " + user.getEmail() + " already exists");
        }
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        try {
            userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new DataIntegrityViolationException("User with email " + user.getEmail() + " already exists");
        }
        return user;
    }
    public List<User> searchUsersByName(String query) {
        return userRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(query, query);
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    public void saveUser(User user) {
        userRepository.save(user);
    }
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    @Transactional
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    @Transactional
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    public String hashPassword(String plainTextPassword){
        return passwordEncoder.encode(plainTextPassword);
    }
}
