package com.Lagos.State.University.Virtual.Notice.Board.Service;

import com.Lagos.State.University.Virtual.Notice.Board.Entity.Comment;
import com.Lagos.State.University.Virtual.Notice.Board.Exception.GeneralException;

import java.util.List;

public interface CommitService {

    Comment createComment (Comment comment) throws GeneralException;

    List<Comment> getByAnswerId(Long request) throws GeneralException;

    Comment getCommentById (Long id) throws GeneralException;

    Comment updateComment(Long id , Comment request) throws GeneralException;

    void deleteById (Long id) throws GeneralException;
}
