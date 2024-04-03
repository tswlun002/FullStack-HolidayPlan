package com.tour.service;

import com.tour.model.SecurityQuestion;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public interface ISecurityQuestions {
    void save();
    Optional<SecurityQuestion> findByNumber(int questionNumber);
    Optional<SecurityQuestion> findByQuestion(String question);

    Set<SecurityQuestion> getSecurityQuestions();
}
