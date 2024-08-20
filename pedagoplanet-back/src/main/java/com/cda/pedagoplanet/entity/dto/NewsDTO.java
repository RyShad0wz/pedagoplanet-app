package com.cda.pedagoplanet.entity.dto;

import com.cda.pedagoplanet.entity.News;
import com.cda.pedagoplanet.entity.enums.Genre;

import java.time.LocalDateTime;

public class NewsDTO {

    private Long id;
    private String title;
    private String content;
    private Long teacherId;
    private String teacherName;
    private Genre teacherGenre;
    private Long courseId;
    private String courseName;
    private LocalDateTime createdAt;

    public NewsDTO() {
    }

    public NewsDTO(News news) {
        this.id = news.getId();
        this.title = news.getTitle();
        this.content = news.getContent();
        this.teacherId = news.getTeacher().getId();
        this.teacherName = news.getTeacher().getFirstName() + " " + news.getTeacher().getLastName();
        this.teacherGenre = news.getTeacher().getGenre();
        this.courseId = news.getCourse().getId();
        this.courseName = news.getCourse().getCourseName();
        this.createdAt = news.getCreatedAt();
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

    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }

    public Long getTeacherId() {
        return teacherId;
    }
    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public String getTeacherName() {
        return teacherName;
    }
    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public Genre getTeacherGenre() {
        return teacherGenre;
    }

    public void setTeacherGenre(Genre teacherGenre) {
        this.teacherGenre = teacherGenre;
    }

    public Long getCourseId() {
        return courseId;
    }
    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseName() {
        return courseName;
    }
    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
