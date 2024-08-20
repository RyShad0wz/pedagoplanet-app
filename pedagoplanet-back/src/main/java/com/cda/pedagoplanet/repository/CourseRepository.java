package com.cda.pedagoplanet.repository;

import com.cda.pedagoplanet.entity.Course;
import com.cda.pedagoplanet.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByTeacher(User teacher);
    List<Course> findByStudentsContaining(User student);
    List<Course> findByTeacherId(Long teacherId);

    @Query("SELECT c FROM Course c LEFT JOIN FETCH c.students WHERE c.id = :courseId")
    Optional<Course> findCourseWithStudents(@Param("courseId") Long courseId);

    @Query("SELECT c FROM Course c WHERE :userId NOT IN (SELECT s.id FROM c.students s)")
    List<Course> findCoursesNotEnrolledByUserId(@Param("userId") Long userId);

    @Query("SELECT c FROM Course c JOIN c.students s WHERE s.id = :userId")
    List<Course> findCoursesEnrolledByUserId(@Param("userId") Long userId);
}

