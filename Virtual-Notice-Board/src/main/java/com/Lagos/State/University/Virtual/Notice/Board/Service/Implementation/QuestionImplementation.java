package com.Lagos.State.University.Virtual.Notice.Board.Service.Implementation;

import com.Lagos.State.University.Virtual.Notice.Board.Entity.Profile;
import com.Lagos.State.University.Virtual.Notice.Board.Entity.Question;
import com.Lagos.State.University.Virtual.Notice.Board.Exception.GeneralException;
import com.Lagos.State.University.Virtual.Notice.Board.Repository.ProfileRepository;
import com.Lagos.State.University.Virtual.Notice.Board.Repository.QuestionRepository;
import com.Lagos.State.University.Virtual.Notice.Board.Service.QuestionService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class QuestionImplementation implements QuestionService {



    private final QuestionRepository questionRepository;
    private final ProfileRepository profileRepository;

    public QuestionImplementation( QuestionRepository questionRepository, ProfileRepository profileRepository) {

        this.questionRepository = questionRepository;
        this.profileRepository = profileRepository;
    }


    @Override
    public Question createQuestion(Question request) throws GeneralException {

        Optional<Profile> profile = profileRepository.findByMatricNumber(request.getMatricNo());

        if (profile.isPresent()) {
            Question question = new Question();


            question.setTitle(request.getTitle());
            question.setContent(request.getContent());
            question.setProfile(profile.get());
            question.setCreatedDate(LocalDateTime.now());
            question.setMatricNo(request.getMatricNo());


         return questionRepository.save(question);
        }
        else  {
            throw new GeneralException("Error in Creating a question");
        }
    }

    @Override
    public Question getQuestionById(Long id) throws GeneralException {
        
        return questionRepository.findById(id).orElseThrow(
                () -> new GeneralException("Question with id "+id+" Not Found"));
    }

    @Override
    public List<Question> listAllQuestion() throws GeneralException {
        try {
            return questionRepository.findAllByOrderByCreatedDateDesc();
        } catch (Exception e) {
            throw new GeneralException("Failed to list questions");
        }
    }

    @Override
    public Question updateQuestion(Long id, Question question) throws GeneralException {

        Question request = getQuestionById(id);
        request.setTitle(question.getTitle());
        request.setContent(question.getContent());

        return questionRepository.save(request);
    }

    @Override
    public void deleteById(Long id) throws GeneralException {

        questionRepository.deleteById(id);
    }
}
