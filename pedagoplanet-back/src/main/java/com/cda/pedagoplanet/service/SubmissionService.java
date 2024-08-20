package com.cda.pedagoplanet.service;

import com.cda.pedagoplanet.entity.Assignment;
import com.cda.pedagoplanet.entity.Submission;
import com.cda.pedagoplanet.entity.User;
import com.cda.pedagoplanet.entity.dto.SubmissionDTO;
import com.cda.pedagoplanet.exception.ResourceNotFoundException;
import com.cda.pedagoplanet.repository.AssignmentRepository;
import com.cda.pedagoplanet.repository.SubmissionRepository;
import com.cda.pedagoplanet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    public List<SubmissionDTO> getSubmissionsByAssignmentId(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId).stream()
                .map(SubmissionDTO::new)
                .collect(Collectors.toList());
    }

    public List<SubmissionDTO> getSubmissionsByStudentId(Long studentId) {
        return submissionRepository.findByStudentId(studentId).stream()
                .map(SubmissionDTO::new)
                .collect(Collectors.toList());
    }

    public SubmissionDTO saveOrUpdateSubmission(SubmissionDTO submissionDTO) throws ResourceNotFoundException {
        User student = userRepository.findById(submissionDTO.getStudent().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        Assignment assignment = assignmentRepository.findById(submissionDTO.getAssignment().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        Optional<Submission> existingSubmission = submissionRepository.findByStudentIdAndAssignmentId(student.getId(), assignment.getId());

        Submission submission;
        if (existingSubmission.isPresent()) {
            submission = existingSubmission.get();
            submission.setFileUrl(submissionDTO.getFileUrl());
            submission.setGrade(submissionDTO.getGrade());
        } else {
            submission = new Submission();
            submission.setFileUrl(submissionDTO.getFileUrl());
            submission.setGrade(submissionDTO.getGrade());
            submission.setStudent(student);
            submission.setAssignment(assignment);
        }
        return new SubmissionDTO(submissionRepository.save(submission));
    }

    public SubmissionDTO gradeSubmission(Long submissionId, double grade) throws ResourceNotFoundException {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));
        submission.setGrade(grade);
        return new SubmissionDTO(submissionRepository.save(submission));
    }
}
