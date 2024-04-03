package com.tour.service;

import com.tour.dto.SecurityQuestionAnswerDTO;
import com.tour.exception.CatchException;
import com.tour.exception.DuplicateException;
import com.tour.exception.NotFoundException;
import com.tour.exception.NullException;
import com.tour.model.SecurityQuestionAnswer;
import com.tour.repository.SecurityQuestionAnswerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@RequiredArgsConstructor
@Service
public class SecurityQuestionAnswerService implements  ISecurityQuestionAnswer{
    private  final SecurityQuestionAnswerRepository repository;
    private  final  ISecurityQuestions securityQuestions;
    @Override
    public boolean save(SecurityQuestionAnswerDTO answerDTO) {
        if(answerDTO==null) throw  new NullException("Invalid security answer");
        var userAnswers = findByUsername(answerDTO.user().getUsername());
        if(userAnswers.size()==3) throw new DuplicateException("User already have security questions");
        if(userAnswers.stream().anyMatch(answer1-> answer1.getQuestion().getNumber().equals(answerDTO.number())))
            throw  new DuplicateException("Answer of Question number "+ answerDTO.number()+" is already exist");
        var question = securityQuestions.findByNumber(answerDTO.number()).
            orElseThrow(()->new NotFoundException("Question number "+answerDTO.answer()+" is not found."));

        var isSaved=false;
        try{

               var answer = SecurityQuestionAnswer.builder().user(answerDTO.user()).
                       question(question).answer(answerDTO.answer()).build();

               repository.save(answer);

               isSaved=true;
         }catch (Exception e){
             CatchException.catchException(e);
         }
        return isSaved;
    }



    @Override
    public Set<SecurityQuestionAnswer> findByUsername(String username) {
        return repository.findByUsername(username);
    }

    @Override
    public boolean deleteByUsername(String username) {
        var answers= repository.findByUsername(username);
        if(answers.isEmpty())throw new NotFoundException("Security questions of user are not found");
        var isDeleted=false;
        try{
            answers.forEach(repository::delete);
            isDeleted=true;
        }catch (Exception e){
            CatchException.catchException(e);
        }
        return  isDeleted;
    }

    @Override
    public Optional<SecurityQuestionAnswer> findByNumber(int questionNumber) {
        return repository.findByNumber(questionNumber);
    }

    @Override
    public Optional<SecurityQuestionAnswer> findByQuestion(String question) {
        return repository.findByQuestion(question);
    }

    @Override
    public final boolean checkAnswers(String username, Map<String, String> answers) {
        var actualAnswers= repository.findByUsername(username);

        if(actualAnswers.isEmpty())throw new NotFoundException("User security questions not found");

        return 
                actualAnswers.stream().allMatch(actualAnswer->{
                    var answer = answers.get(actualAnswer.getQuestion().getQuestion().trim());
                    return (answer!=null)&&answer.trim().equalsIgnoreCase(actualAnswer.getAnswer().trim());
                });

    }
}
