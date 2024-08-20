package com.cda.pedagoplanet.repository;

import com.cda.pedagoplanet.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
}
