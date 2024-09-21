package com.Lagos.State.University.Virtual.Notice.Board.Controller;

import com.Lagos.State.University.Virtual.Notice.Board.Entity.Comment;
import com.Lagos.State.University.Virtual.Notice.Board.Entity.Dashboard;
import com.Lagos.State.University.Virtual.Notice.Board.Service.Implementation.CommentImplementation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/comment")
public class CommentController {

   private final CommentImplementation commentImplementation;

    public CommentController(CommentImplementation commentImplementation) {
        this.commentImplementation = commentImplementation;
    }

    @GetMapping("/list/{id}")
    public List<Comment> getAnswerById(@PathVariable("id") Long id) {
        return commentImplementation.getByAnswerId(id);
    }


    @GetMapping("/list")
    public List<Comment> getAnswer (){

        return commentImplementation.getAllComment();
    }

    @PostMapping("/add")
    public ResponseEntity <?> createComment(@RequestBody Comment request){

        Comment response = commentImplementation.createComment(request);
        return ResponseEntity.ok()
                .body(response);
    }

    @PutMapping("/update")
    public ResponseEntity <?> updateComment (@PathVariable Long id, @RequestBody Comment request){

        Comment response = commentImplementation.updateComment(id, request);

        return ResponseEntity.ok()
                .body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity <?> getById (@PathVariable Long id){

        Comment response = commentImplementation.getCommentById(id);

        return ResponseEntity.ok()
                .body(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity <?> deleteComment(@PathVariable Long id)
    {
        commentImplementation.deleteById(id);

        return ResponseEntity.ok()
                .build();
    }

    /*@DeleteMapping("/delete")
    public ResponseEntity <?> deleteAllComment()
    {
        commentImplementation.deleteAll();

        return ResponseEntity.ok()
                .build();
    }*/
}
