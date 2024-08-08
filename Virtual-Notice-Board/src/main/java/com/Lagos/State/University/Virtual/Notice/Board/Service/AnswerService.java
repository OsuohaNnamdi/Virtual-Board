package com.Lagos.State.University.Virtual.Notice.Board.Service;

import com.Lagos.State.University.Virtual.Notice.Board.Entity.Answer;
import com.Lagos.State.University.Virtual.Notice.Board.Exception.GeneralException;

import java.util.List;

public interface AnswerService {

    void upVote (Long requestId) throws GeneralException;

    void downVote (Long requestId) throws GeneralException;

    void createAnswer (Answer request) throws GeneralException;

    Answer getAnswerById (Long id) throws GeneralException;

    List<Answer> getAnswerByList (Long id) throws GeneralException;

    Answer updateAnswer (Long id , Answer request) throws GeneralException;

    void deleteById (Long id) throws GeneralException;
}
