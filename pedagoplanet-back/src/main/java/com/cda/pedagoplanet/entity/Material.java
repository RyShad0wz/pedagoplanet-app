package com.cda.pedagoplanet.entity;

import javax.persistence.*;

@Entity
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String url;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    public Material() {
    }

    public Material(Long id, String name, String url, Course course) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.course = course;
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


    public Course getCourse() {
        return course;
    }
    public void setCourse(Course course) {
        this.course = course;
    }
}


