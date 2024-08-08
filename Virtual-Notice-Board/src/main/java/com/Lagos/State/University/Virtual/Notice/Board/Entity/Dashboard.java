package com.Lagos.State.University.Virtual.Notice.Board.Entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "dashboard")
public class Dashboard {
    @Id
    @SequenceGenerator(
            name = "Dashboard_sequence",
            sequenceName = "Dashboard_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "Dashboard_sequence")
    private Long id;

    private String subject;

    private String source;

    private String imageUrl;

    private String faculty;

    private String mains;

    private String department;

    private String content;

    private LocalDate date;


    public Dashboard(Long id, String subject, String source, String imageUrl, String faculty, String mains, String department, String content, LocalDate date) {
        this.id = id;
        this.subject = subject;
        this.source = source;
        this.imageUrl = imageUrl;
        this.faculty = faculty;
        this.mains = mains;
        this.department = department;
        this.content = content;
        this.date = date;
    }

    public Dashboard() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }


    public String getMains() {
        return mains;
    }

    public void setMains(String mains) {
        this.mains = mains;
    }

    public String getFaculty() {
        return faculty;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}
