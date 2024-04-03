package com.tour.service;

import com.tour.dto.SecurityQuestionAnswerDTO;
import com.tour.model.SecurityQuestionAnswer;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
public interface ISecurityQuestionAnswer {
    boolean save(SecurityQuestionAnswerDTO answer);
     Set<SecurityQuestionAnswer> findByUsername(String username);

    boolean deleteByUsername(String username);
    Optional<SecurityQuestionAnswer> findByNumber(int questionNumber);
    Optional<SecurityQuestionAnswer> findByQuestion(String question);

    boolean checkAnswers(String username, Map<String, String> answers);
}
