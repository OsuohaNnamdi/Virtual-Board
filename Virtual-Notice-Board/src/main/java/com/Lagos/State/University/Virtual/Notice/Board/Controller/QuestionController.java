package com.Lagos.State.University.Virtual.Notice.Board.Controller;

 import com.Lagos.State.University.Virtual.Notice.Board.Entity.Question;
import com.Lagos.State.University.Virtual.Notice.Board.Service.Implementation.QuestionImplementation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/api/v1/question")
public class QuestionController {

    private final QuestionImplementation questionImplementation;

    public QuestionController(QuestionImplementation questionImplementation) {
        this.questionImplementation = questionImplementation;
    }

    @PostMapping("/add")
    public ResponseEntity<?> createQuestion(@RequestBody Question request){

       Question question = questionImplementation.createQuestion(request);
        return ResponseEntity.ok()
                .body(question);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity <?> updateQuestion (@PathVariable Long id, @RequestBody Question request){

        Question response = questionImplementation.updateQuestion(id, request);

        return ResponseEntity.ok()
                .body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity <?> getById (@PathVariable Long id){

        Question response = questionImplementation.getQuestionById(id);

        return ResponseEntity.ok()
                .body(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity <?> deleteQuestion(@PathVariable Long id)
    {
        questionImplementation.deleteById(id);

        return ResponseEntity.ok()
                .build();
    }

    @GetMapping("/list")
    public List<Question> listQuestion(){

        return questionImplementation.listAllQuestion();
    }

    @GetMapping("/search")
    public List<Question> searchQuestion(@RequestParam  String query){

        List <Question> allQuestion = questionImplementation.listAllQuestion();

        return allQuestion.stream()
                .filter(q -> q.getTitle().contains(query) || q.getContent().contains(query))
                .collect(Collectors.toList());

    }
}