package com.cda.pedagoplanet.controller;

import com.cda.pedagoplanet.entity.dto.SubmissionDTO;
import com.cda.pedagoplanet.exception.ResourceNotFoundException;
import com.cda.pedagoplanet.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<List<SubmissionDTO>> getSubmissionsByAssignment(@PathVariable Long assignmentId) {
        List<SubmissionDTO> submissions = submissionService.getSubmissionsByAssignmentId(assignmentId);
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<SubmissionDTO>> getSubmissionsByStudent(@PathVariable Long studentId) {
        List<SubmissionDTO> submissions = submissionService.getSubmissionsByStudentId(studentId);
        return ResponseEntity.ok(submissions);
    }

    @PostMapping
    public ResponseEntity<SubmissionDTO> addSubmission(@RequestBody SubmissionDTO submissionDTO) {
        try {
            SubmissionDTO savedSubmission = submissionService.saveOrUpdateSubmission(submissionDTO);
            return ResponseEntity.ok(savedSubmission);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).build();
        }
    }

    @PutMapping("/{submissionId}/grade")
    public ResponseEntity<SubmissionDTO> gradeSubmission(@PathVariable Long submissionId, @RequestBody Map<String, Double> gradeMap) {
        try {
            double grade = gradeMap.get("grade");
            SubmissionDTO gradedSubmission = submissionService.gradeSubmission(submissionId, grade);
            return ResponseEntity.ok(gradedSubmission);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).build();
        }
    }
}
