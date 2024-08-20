package com.cda.pedagoplanet.config;

import com.cda.pedagoplanet.entity.Role;
import com.cda.pedagoplanet.entity.enums.RoleName;
import com.cda.pedagoplanet.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;

import java.util.Optional;

@Configuration
public class DataInitializationConfig {

    @Autowired
    private RoleRepository roleRepository;

    @EventListener
    public void onApplicationEvent(ContextRefreshedEvent event) {
        initializeRoles();
    }

    private void initializeRoles() {
        createRoleIfNotFound(RoleName.STUDENT);
        createRoleIfNotFound(RoleName.TEACHER);
    }

    private void createRoleIfNotFound(RoleName name) {
        Optional<Role> roleOptional = roleRepository.findByName(name);
        if (!roleOptional.isPresent()) {
            Role role = new Role();
            role.setName(name);
            roleRepository.save(role);
        }
    }
}


