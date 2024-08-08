package com.Lagos.State.University.Virtual.Notice.Board.Service;

import com.Lagos.State.University.Virtual.Notice.Board.Entity.Question;
import com.Lagos.State.University.Virtual.Notice.Board.Exception.GeneralException;

import java.util.List;

public interface QuestionService {

    Question createQuestion (Question question) throws GeneralException;

    Question getQuestionById (Long id) throws GeneralException;

    List<Question> listAllQuestion () throws GeneralException;

    Question updateQuestion (Long id , Question question) throws GeneralException;

    void deleteById (Long id) throws GeneralException;
}
