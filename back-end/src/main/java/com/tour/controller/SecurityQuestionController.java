package com.tour.controller;
import com.tour.service.SecurityQuestionsService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/holiday-plan/api/user/security-questions")
@AllArgsConstructor
public class SecurityQuestionController {
    private  final SecurityQuestionsService service;
    @GetMapping("/")
    public ResponseEntity<?> getSecurityQuestions(){
        var questions = service.getSecurityQuestions();

        if( !questions.isEmpty()){
            return  new ResponseEntity<>(questions,OK);
        }
        else
            return     new ResponseEntity<>("No Security questions",NOT_FOUND);

    }
}
