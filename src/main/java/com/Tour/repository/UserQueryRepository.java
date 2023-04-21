package com.Tour.repository;

import com.Tour.model.QueryStatus;
import com.Tour.model.UserQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserQueryRepository extends JpaRepository<UserQuery, Long> {
    @Query("select t from UserQuery t join fetch t.user " +
            "where t.id=:id")
    Optional<UserQuery> findById(long id);
    @Query("select t from UserQuery t join fetch t.user u " +
            "where t.id=:id and user.id=:userId")
    Optional<UserQuery> findByIdAndUserId(long id,long userId);

    @Query("select t from UserQuery t join fetch t.user u " +
            "where u.id=:userId")
    List<UserQuery> findByUserId(long userId);

    @Query("select t from UserQuery t join fetch t.user u " +
            "where u.id=:userId and t.queryStatus=:queryStatus")
    List<UserQuery> findAllUserQueryByUserAndQueryStatus(long userId,      QueryStatus queryStatus);
    @Query("select t from UserQuery t join fetch t.user u " +
            "where  t.queryStatus=:queryStatus")
    List<UserQuery> findAllUserQueryByQueryStatus(QueryStatus queryStatus);
    @Query("select t from Token t join fetch t.user " +
            "where t.token=:token")
    List<UserQuery> findByAllQuery();
    @Query("select t from UserQuery t join fetch t.user u " +
            "where t.id=:queryId and u.id=:userId  and t.queryStatus=:queryStatus")
    Optional<UserQuery> findAllValidUserQueryByUser(long queryId, long userId, QueryStatus queryStatus);
}
