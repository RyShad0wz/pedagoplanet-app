package com.cda.pedagoplanet.repository;

import com.cda.pedagoplanet.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
}
