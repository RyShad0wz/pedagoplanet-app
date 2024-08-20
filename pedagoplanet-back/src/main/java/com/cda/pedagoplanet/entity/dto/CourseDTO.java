package com.cda.pedagoplanet.entity.dto;

import com.cda.pedagoplanet.entity.Course;

public class CourseDTO {
    private Long id;
    private String courseName;
    private String description;
    private String conferenceUrl;
    private String teacherName;
    private String teacherGenre;
    private Long teacherId;

    public CourseDTO(Course course) {
        this.id = course.getId();
        this.courseName = course.getCourseName();
        this.description = course.getDescription();
        this.conferenceUrl = course.getConferenceUrl();
        if (course.getTeacher() != null) {
            this.teacherName = course.getTeacher().getLastName();
            this.teacherGenre = String.valueOf(course.getTeacher().getGenre());
            this.teacherId = course.getTeacher().getId();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getConferenceUrl() {
        return conferenceUrl;
    }

    public void setConferenceUrl(String conferenceUrl) {
        this.conferenceUrl = conferenceUrl;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public String getTeacherGenre() {
        return teacherGenre;
    }

    public void setTeacherGenre(String teacherGenre) {
        this.teacherGenre = teacherGenre;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public CourseDTO() {
    }
}
