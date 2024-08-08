package com.Lagos.State.University.Virtual.Notice.Board.Repository;

import com.Lagos.State.University.Virtual.Notice.Board.Entity.Answer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer , Long>
{

  @Query("SELECT b FROM Answer b WHERE b.questionId = :questionId")
  List <Answer> findByQuestionId(@Param("questionId") Long questionId);
}
