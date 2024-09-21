package com.Lagos.State.University.Virtual.Notice.Board.Entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@Table(name = "answer")
public class Answer {
    @Id
    @SequenceGenerator(
            name = "answer_sequence",
            sequenceName = "answer_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "answer_sequence")
    private Long id;

    @Column(nullable = false)
    private String content;

    private String firstName;

    private String lastName;

    private Long questionId;

    private LocalDateTime date;
    private int upVotes;

    private Integer downVotes;



    public Answer() {
    }

    public Answer(Long id, String content, String firstName, String lastName, Long questionId, LocalDateTime date, int upVotes, Integer downVotes) {
        this.id = id;
        this.content = content;
        this.firstName = firstName;
        this.lastName = lastName;
        this.questionId = questionId;
        this.date = date;
        this.upVotes = upVotes;
        this.downVotes = downVotes;
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

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public int getUpVotes() {
        return upVotes;
    }

    public void setUpVotes(int upVotes) {
        this.upVotes = upVotes;
    }

    public Integer getDownVotes() {
        return downVotes;
    }

    public void setDownVotes(Integer downVotes) {
        this.downVotes = downVotes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }
}