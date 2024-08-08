package com.Lagos.State.University.Virtual.Notice.Board.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "comment")
public class Comment {

    @Id
    @SequenceGenerator(
            name = "answers_sequence",
            sequenceName = "answers_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "answers_sequence")
    private Long id;

    private Long answerId;

    @Column(nullable = false)
    private String content;

    private String firstName;

    private String lastName;

    public Comment() {
    }

    public Comment(Long answerid, String content, String firstName, String lastName) {
        this.answerId = answerid;
        this.content = content;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public Long getAnswerId() {
        return answerId;
    }

    public void setAnswerId(Long answerId) {
        this.answerId = answerId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }


    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

}
