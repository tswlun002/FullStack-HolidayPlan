package com.tour.repository;

import com.tour.model.SecurityQuestionAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;
@Repository
public interface SecurityQuestionAnswerRepository extends JpaRepository<SecurityQuestionAnswer,Long> {

    @Query("select a from SecurityQuestionAnswer a join fetch a.question q join fetch a.user u where u.username=:username")
    Set<SecurityQuestionAnswer> findByUsername(String username);
    @Query("select a from SecurityQuestionAnswer a join fetch a.question q join fetch a.user  where q.number=:questionNumber")
    Optional<SecurityQuestionAnswer> findByNumber(int questionNumber);
    @Query("select a from SecurityQuestionAnswer a join fetch a.question q join fetch a.user  where q.question=:question")
    Optional<SecurityQuestionAnswer> findByQuestion(String question);

}
