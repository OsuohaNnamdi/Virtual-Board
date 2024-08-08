package com.Lagos.State.University.Virtual.Notice.Board.Service.Implementation;

import com.Lagos.State.University.Virtual.Notice.Board.Entity.Answer;
import com.Lagos.State.University.Virtual.Notice.Board.Entity.Question;
import com.Lagos.State.University.Virtual.Notice.Board.Exception.GeneralException;
import com.Lagos.State.University.Virtual.Notice.Board.Repository.AnswerRepository;
import com.Lagos.State.University.Virtual.Notice.Board.Repository.ProfileRepository;
import com.Lagos.State.University.Virtual.Notice.Board.Repository.QuestionRepository;
import com.Lagos.State.University.Virtual.Notice.Board.Service.AnswerService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AnswerImplementation implements AnswerService {

    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;



    public AnswerImplementation(AnswerRepository answerRepository, QuestionRepository questionRepository) {
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
    }

    @Override
    public void upVote(Long requestId) throws GeneralException {
        Answer answer = answerRepository.findById(requestId).orElseThrow(() ->
                new GeneralException("Answer is not present in the database"));
        answer.setUpVotes(answer.getUpVotes() + 1);
        answerRepository.save(answer);
    }

    @Override
    public void downVote(Long requestId) throws GeneralException {
        Answer answer =  answerRepository.findById(requestId).orElseThrow(() ->
                new GeneralException("Answer is not present in the database"));

        answer.setDownVotes(answer.getDownVotes() + 1);
        answerRepository.save(answer);
    }

    @Override
    public void createAnswer(Answer request) throws GeneralException {



        Question question = questionRepository.findById(request.getQuestionId()).orElseThrow(
                () -> new GeneralException("Error"));

        if (question != null){


            Answer answer = new Answer();

            answer.setFirstName(question.getProfile().getFirstName());
            answer.setLastName(question.getProfile().getLastName());
            answer.setContent(request.getContent());
            answer.setDate(LocalDate.now());
            answer.setQuestionId(question.getId());
            answer.setUpVotes(0);
            answer.setDownVotes(0);

            answerRepository.save(answer);
        }
        else {
            throw new GeneralException("Error in saving answer");
        }
    }

    @Override
    public Answer getAnswerById(Long id) throws GeneralException {
         return answerRepository.findById(id).orElseThrow(() -> new GeneralException("Answer with Id "+id+" does not exist"));
    }

    @Override
    public List<Answer> getAnswerByList(Long id) throws GeneralException {
        return answerRepository
                .findByQuestionId(id);
    }


    @Override
    public Answer updateAnswer(Long id, Answer request) throws GeneralException {

        Answer answer = getAnswerById(id);
        answer.setContent(request.getContent());

        return answerRepository.save(answer);
    }

    @Override
    public void deleteById(Long id) throws GeneralException {

        answerRepository.deleteById(id);
    }

}
