package com.cda.pedagoplanet.repository;

import com.cda.pedagoplanet.entity.Role;
import com.cda.pedagoplanet.entity.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
    Role getRoleById(Long id);
}

