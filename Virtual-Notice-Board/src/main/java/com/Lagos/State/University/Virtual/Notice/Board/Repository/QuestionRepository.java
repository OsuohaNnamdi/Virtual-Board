package com.Lagos.State.University.Virtual.Notice.Board.Repository;

import com.Lagos.State.University.Virtual.Notice.Board.Entity.Profile;
import com.Lagos.State.University.Virtual.Notice.Board.Entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, Long> {


     @Query("SELECT q FROM Question q ORDER BY q.createdDate DESC")
    List<Question> findAllByOrderByCreatedDateDesc();
}
