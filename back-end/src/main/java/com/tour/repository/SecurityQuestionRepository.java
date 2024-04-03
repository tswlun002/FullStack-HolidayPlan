package com.tour.repository;

import com.tour.model.SecurityQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;
@Repository
public interface SecurityQuestionRepository extends JpaRepository<SecurityQuestion,Long> {

    @Query("select q from SecurityQuestion q  where q.number=:questionNumber")
    Optional<SecurityQuestion> findByNumber(int questionNumber);
    @Query("select q from SecurityQuestion q  where q.question=:question")
    Optional<SecurityQuestion> findByQuestion(String question);

    @Query("select q from SecurityQuestion q")
    Set<SecurityQuestion> findQuestions();
}
