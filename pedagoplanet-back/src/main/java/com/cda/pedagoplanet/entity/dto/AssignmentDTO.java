package com.cda.pedagoplanet.entity.dto;

import com.cda.pedagoplanet.entity.Assignment;
import com.cda.pedagoplanet.entity.Course;

import java.time.LocalDateTime;

public class AssignmentDTO {

    private Long id;
    private String title;
    private String description;
    private LocalDateTime deadline;
    private Long courseId;

    public AssignmentDTO() {
    }

    public AssignmentDTO(Assignment assignment) {
        this.id = assignment.getId();
        this.title = assignment.getTitle();
        this.description = assignment.getDescription();
        this.deadline = assignment.getDeadline();
        this.courseId = assignment.getCourse().getId();
    }


    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }
    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }

    public Long getCourseId() {
        return courseId;
    }
    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
}

