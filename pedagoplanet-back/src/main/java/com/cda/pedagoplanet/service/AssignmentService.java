package com.cda.pedagoplanet.service;

import com.cda.pedagoplanet.entity.Assignment;
import com.cda.pedagoplanet.entity.Course;
import com.cda.pedagoplanet.entity.dto.AssignmentDTO;
import com.cda.pedagoplanet.exception.ResourceNotFoundException;
import com.cda.pedagoplanet.repository.AssignmentRepository;
import com.cda.pedagoplanet.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    public List<AssignmentDTO> getAssignmentsByCourseId(Long courseId) {
        return assignmentRepository.findByCourseId(courseId).stream()
                .map(AssignmentDTO::new)
                .collect(Collectors.toList());
    }

    public AssignmentDTO getAssignmentById(Long assignmentId) throws ResourceNotFoundException {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));
        return new AssignmentDTO(assignment);
    }

    public AssignmentDTO saveAssignment(AssignmentDTO assignmentDTO) throws ResourceNotFoundException {
        Course course = courseRepository.findById(assignmentDTO.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Assignment assignment = new Assignment();
        assignment.setTitle(assignmentDTO.getTitle());
        assignment.setDescription(assignmentDTO.getDescription());
        assignment.setDeadline(assignmentDTO.getDeadline());
        assignment.setCourse(course);

        return new AssignmentDTO(assignmentRepository.save(assignment));
    }

    public AssignmentDTO updateAssignment(Long assignmentId, AssignmentDTO assignmentDTO) throws ResourceNotFoundException {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        Course course = courseRepository.findById(assignmentDTO.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        assignment.setTitle(assignmentDTO.getTitle());
        assignment.setDescription(assignmentDTO.getDescription());
        assignment.setDeadline(assignmentDTO.getDeadline());
        assignment.setCourse(course);

        return new AssignmentDTO(assignmentRepository.save(assignment));
    }
}
