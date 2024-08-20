package com.cda.pedagoplanet.service;

import com.cda.pedagoplanet.entity.Role;
import com.cda.pedagoplanet.entity.Student;
import com.cda.pedagoplanet.entity.Teacher;
import com.cda.pedagoplanet.entity.enums.RoleName;
import com.cda.pedagoplanet.repository.RoleRepository;
import com.cda.pedagoplanet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Role> getAllRoles() {
        return null;
    }

    public Role getRoleById(Long id) {
        return null;
    }

    public Optional<Role> findByName(RoleName name) {
        return roleRepository.findByName(name);
    }

    @Transactional
    public Teacher createTeacher(Teacher teacher) {
        Role teacherRole = roleRepository.findByName(RoleName.TEACHER)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        teacher.setRoles(Collections.singleton(teacherRole));
        return userRepository.save(teacher);
    }

    @Transactional
    public Student createStudent(Student student) {
        Role studentRole = roleRepository.findByName(RoleName.STUDENT)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        student.setRoles(Collections.singleton(studentRole));
        return userRepository.save(student);
    }
}
