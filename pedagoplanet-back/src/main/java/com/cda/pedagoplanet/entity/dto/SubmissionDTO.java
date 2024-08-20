package com.cda.pedagoplanet.entity.dto;

import com.cda.pedagoplanet.entity.Assignment;
import com.cda.pedagoplanet.entity.Submission;

public class SubmissionDTO {

    private Long id;
    private String fileUrl;
    private double grade;
    private UserSearchDTO student;
    private Assignment assignment;

    public SubmissionDTO() {
    }

    public SubmissionDTO(Submission submission) {
        this.id = submission.getId();
        this.fileUrl = submission.getFileUrl();
        this.grade = submission.getGrade();
        this.student = new UserSearchDTO(submission.getStudent());
        this.assignment = submission.getAssignment();
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getFileUrl() {
        return fileUrl;
    }
    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public double getGrade() {
        return grade;
    }
    public void setGrade(double grade) {
        this.grade = grade;
    }

    public UserSearchDTO getStudent() {
        return student;
    }
    public void setStudent(UserSearchDTO student) {
        this.student = student;
    }

    public Assignment getAssignment() {
        return assignment;
    }
    public void setAssignment(Assignment assignment) {
        this.assignment = assignment;
    }

    @Override
    public String toString() {
        return "SubmissionDTO{" +
                "id=" + id +
                ", fileUrl='" + fileUrl + '\'' +
                ", grade=" + grade +
                ", student=" + student +
                ", assignment=" + assignment +
                '}';
    }
}

