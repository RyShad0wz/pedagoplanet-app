package com.cda.pedagoplanet.repository;

import com.cda.pedagoplanet.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByAssignmentId(Long assignmentId);
    List<Submission> findByStudentId(Long studentId);
    Optional<Submission> findByStudentIdAndAssignmentId(Long studentId, Long assignmentId);
    @Query("SELECT s FROM Submission s WHERE s.assignment.course.id = :courseId")
    List<Submission> findByCourseId(@Param("courseId") Long courseId);
    List<Submission> findByAssignmentCourseId(Long courseId);
}

