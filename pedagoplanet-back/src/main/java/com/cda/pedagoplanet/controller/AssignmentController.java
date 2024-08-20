package com.cda.pedagoplanet.controller;

import com.cda.pedagoplanet.entity.dto.AssignmentDTO;
import com.cda.pedagoplanet.exception.ResourceNotFoundException;
import com.cda.pedagoplanet.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<AssignmentDTO>> getAssignmentsByCourseId(@PathVariable Long courseId) {
        List<AssignmentDTO> assignments = assignmentService.getAssignmentsByCourseId(courseId);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/{assignmentId}")
    public ResponseEntity<AssignmentDTO> getAssignmentById(@PathVariable Long assignmentId) {
        try {
            AssignmentDTO assignment = assignmentService.getAssignmentById(assignmentId);
            return ResponseEntity.ok(assignment);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(null);
        }
    }

    @PostMapping
    public ResponseEntity<AssignmentDTO> addAssignment(@RequestBody AssignmentDTO assignmentDTO) {
        try {
            AssignmentDTO savedAssignment = assignmentService.saveAssignment(assignmentDTO);
            return ResponseEntity.ok(savedAssignment);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(null);
        }
    }

    @PutMapping("/{assignmentId}")
    public ResponseEntity<AssignmentDTO> updateAssignment(@PathVariable Long assignmentId, @RequestBody AssignmentDTO assignmentDTO) {
        try {
            AssignmentDTO updatedAssignment = assignmentService.updateAssignment(assignmentId, assignmentDTO);
            return ResponseEntity.ok(updatedAssignment);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(null);
        }
    }
}
