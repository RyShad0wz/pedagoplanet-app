package com.cda.pedagoplanet.controller;
import com.cda.pedagoplanet.entity.User;
import com.cda.pedagoplanet.entity.dto.LoginRequest;
import com.cda.pedagoplanet.entity.dto.UserDTO;
import com.cda.pedagoplanet.entity.dto.UserSearchDTO;
import com.cda.pedagoplanet.exception.AuthentificationFailedException;
import com.cda.pedagoplanet.security.JwtTokenProvider;
import com.cda.pedagoplanet.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtTokenProvider tokenProvider;
    @Autowired
    private UserService userService;
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String role = userDetails.getAuthorities().iterator().next().getAuthority();

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("role", role);

            return ResponseEntity.ok(response);
        } catch (BadCredentialsException ex) {
            throw new AuthentificationFailedException("Erreur d'authentification", ex);
        }
    }
    @GetMapping("/auth/user")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof UserDetails) {
                String username = ((UserDetails) authentication.getPrincipal()).getUsername();
                User user = userService.findByUsername(username);
                return ResponseEntity.ok(new UserDTO(user));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utilisateur non authentifié");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching user details");
        }
    }
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            Optional<User> user = userService.findById(id);
            if (user.isPresent()) {
                return ResponseEntity.ok(new UserDTO(user.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching user details");
        }
    }
    @GetMapping("/users/search")
    public List<UserSearchDTO> searchUsers(@RequestParam("query") String query) {
        List<User> users = userService.searchUsersByName(query);
        return users.stream()
                .map(user -> new UserSearchDTO(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail()))
                .collect(Collectors.toList());
    }
}
