package com.cda.pedagoplanet.service;

import com.cda.pedagoplanet.entity.Submission;
import com.cda.pedagoplanet.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GradeService {

    @Autowired
    private SubmissionRepository submissionRepository;

    public double calculateAverageForCourse(Long courseId) {
        List<Submission> submissions = submissionRepository.findByAssignmentCourseId(courseId);
        if (submissions.isEmpty()) {
            return 0;
        }
        double total = submissions.stream()
                .filter(sub -> sub.getGrade() != null)
                .mapToDouble(Submission::getGrade)
                .sum();
        long count = submissions.stream().filter(sub -> sub.getGrade() != null).count();
        return count == 0 ? 0 : total / count;
    }
}
