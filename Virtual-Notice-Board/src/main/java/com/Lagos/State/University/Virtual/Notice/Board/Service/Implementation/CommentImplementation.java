package com.Lagos.State.University.Virtual.Notice.Board.Service.Implementation;

import com.Lagos.State.University.Virtual.Notice.Board.Entity.Answer;
import com.Lagos.State.University.Virtual.Notice.Board.Entity.Comment;
import com.Lagos.State.University.Virtual.Notice.Board.Exception.GeneralException;
import com.Lagos.State.University.Virtual.Notice.Board.Repository.AnswerRepository;
import com.Lagos.State.University.Virtual.Notice.Board.Repository.CommentRepository;
import com.Lagos.State.University.Virtual.Notice.Board.Service.CommitService;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class CommentImplementation implements CommitService{

    private final CommentRepository commentRepository;
    private final AnswerRepository answerRepository;


    public CommentImplementation(CommentRepository commentRepository, AnswerRepository answerRepository) {
        this.commentRepository = commentRepository;
        this.answerRepository = answerRepository;
    }

    @Override
    public Comment createComment(Comment request) throws GeneralException {

        Answer answer = answerRepository.findById(request.getAnswerId()).orElseThrow(() -> new GeneralException("Answer Not Found"));

        if (answer != null){

            Comment comment = new Comment();

            comment.setContent(request.getContent());
            comment.setAnswerId(request.getAnswerId());
            comment.setFirstName(answer.getFirstName());
            comment.setLastName(answer.getLastName());

            return commentRepository.save(comment);
        }

       else {
           throw new GeneralException("Comment was not registered");
        }
    }

    @Override
    public List<Comment> getByAnswerId(Long request) throws GeneralException {
        return commentRepository.findByAnswerId(request);
    }

    @Override
    public Comment getCommentById(Long id) throws GeneralException {
        return commentRepository.findById(id)
                .orElseThrow(() -> new GeneralException("Comment with id "+id+" does not exist"));
    }

    @Override
    public Comment updateComment(Long id, Comment request) throws GeneralException {

        Comment comment = getCommentById(id);
        comment.setContent(request.getContent());
        return commentRepository.save(comment);
    }

    @Override
    public void deleteById(Long id) throws GeneralException {

        commentRepository.deleteById(id);
    }
}
