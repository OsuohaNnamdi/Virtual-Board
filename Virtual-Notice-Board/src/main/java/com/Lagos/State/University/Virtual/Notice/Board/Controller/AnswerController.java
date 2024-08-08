package com.Lagos.State.University.Virtual.Notice.Board.Controller;

import com.Lagos.State.University.Virtual.Notice.Board.Entity.Answer;
import com.Lagos.State.University.Virtual.Notice.Board.Service.Implementation.AnswerImplementation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/answer")
public class AnswerController {

    private final AnswerImplementation answerImplementation;


    public AnswerController(AnswerImplementation answerImplementation) {
        this.answerImplementation = answerImplementation;
    }

    @PostMapping("/add")
    public ResponseEntity<?> createAnswer(@RequestBody Answer request){

        answerImplementation.createAnswer(request);
        return ResponseEntity.ok()
                .build();
    }

    @PutMapping("/update")
    public ResponseEntity <?> updateAnswer (@PathVariable Long id, @RequestBody Answer request){

        Answer response = answerImplementation.updateAnswer(id, request);

        return ResponseEntity.ok()
                .body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity <?> getById (@PathVariable Long id){

        Answer response = answerImplementation.getAnswerById(id);

        return ResponseEntity.ok()
                .body(response);
    }

    @GetMapping("/list/{id}")
    public List<Answer> getList (@PathVariable Long id){

        return answerImplementation.getAnswerByList(id);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity <?> deleteAnswer(@PathVariable Long id)
    {
        answerImplementation.deleteById(id);

        return ResponseEntity.ok()
                .build();
    }

    @PostMapping("/upvote/{id}")
    public ResponseEntity <?> upVoteAnswer(@PathVariable Long id)
    {
        answerImplementation.upVote(id);

        return ResponseEntity.ok()
                .build();
    }

    @PostMapping("/downvote/{id}")
    public ResponseEntity <?> downVoteAnswer(@PathVariable Long id)
    {
        answerImplementation.downVote(id);

        return ResponseEntity.ok()
                .build();
    }
}
