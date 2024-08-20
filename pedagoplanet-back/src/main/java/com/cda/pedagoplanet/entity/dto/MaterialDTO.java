package com.cda.pedagoplanet.entity.dto;

import com.cda.pedagoplanet.entity.Material;

public class MaterialDTO {
    private Long id;
    private String name;
    private String url;
    private Long courseId;
    private String courseName;

    public MaterialDTO(Long id, String name, String url, Long courseId, String courseName) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.courseId = courseId;
        this.courseName = courseName;
    }

    public MaterialDTO() {
    }

    public MaterialDTO(Material material) {
        this.id = material.getId();
        this.name = material.getName();
        this.url = material.getUrl();
        this.courseId = material.getCourse().getId();
        this.courseName = material.getCourse().getCourseName();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
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
}
