package com.cda.pedagoplanet.controller;

import com.cda.pedagoplanet.entity.Role;
import com.cda.pedagoplanet.entity.User;
import com.cda.pedagoplanet.entity.dto.UserDTO;
import com.cda.pedagoplanet.entity.enums.RoleName;
import com.cda.pedagoplanet.service.RoleService;
import com.cda.pedagoplanet.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        try {
            User user = new User();
            user.setFirstName(userDTO.getFirstName());
            user.setLastName(userDTO.getLastName());
            user.setGenre(userDTO.getGenre());
            user.setDateOfBirth(userDTO.getDateOfBirth());
            user.setUsername(userDTO.getUsername());
            user.setPassword(userDTO.getPassword());
            user.setEmail(userDTO.getEmail());

            Role role = roleService.findByName(RoleName.valueOf(userDTO.getRole()))
                    .orElseThrow(() -> new RuntimeException("Error: Role not found."));
            user.setRoles(Collections.singleton(role));

            userService.saveUser(user);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Registration failed: " + e.getMessage());
        }
    }
}


