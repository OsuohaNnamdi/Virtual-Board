package com.Lagos.State.University.Virtual.Notice.Board.Repository;

import com.Lagos.State.University.Virtual.Notice.Board.Entity.Comment;
import com.Lagos.State.University.Virtual.Notice.Board.Entity.Dashboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT b FROM Comment b WHERE b.answerId = :answerId")
    List<Comment> findByAnswerId(@Param("answerId") Long answerId);
}
