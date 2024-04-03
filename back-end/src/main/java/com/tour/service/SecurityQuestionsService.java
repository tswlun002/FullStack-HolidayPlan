package com.tour.service;

import com.tour.exception.CatchException;
import com.tour.exception.NullException;
import com.tour.model.SecurityQuestion;
import com.tour.repository.SecurityQuestionRepository;
import com.tour.utils.SecurityQuestions;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.Set;
import java.util.stream.IntStream;

@RequiredArgsConstructor
@Service
public class SecurityQuestionsService implements  ISecurityQuestions{
    private  final SecurityQuestionRepository repository;

    @Override
    @PostConstruct
    public void save() {;

        try{
            if(repository.count()==0) {
                var questions =SecurityQuestions.questions;
                if(questions.length == 0)throw  new NullException("Security questions are null/invalid");
                IntStream.range(0,questions.length).forEach(number->{
                            var question= SecurityQuestion.builder().number(number).question(questions[number]).build();
                            repository.save(question);
                        }
                );
            }
         }catch (Exception e){
             CatchException.catchException(e);
         }
    }

    @Override
    public Optional<SecurityQuestion> findByNumber(int questionNumber) {
        return repository.findByNumber(questionNumber);
    }

    @Override
    public Optional<SecurityQuestion> findByQuestion(String question) {
        return repository.findByQuestion(question);
    }

    @Override
    public Set<SecurityQuestion> getSecurityQuestions() {
        return repository.findQuestions();
    }


}
