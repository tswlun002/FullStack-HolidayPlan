package com.Tour.service;

import com.Tour.model.QueryStatus;
import com.Tour.model.UserQuery;


import java.util.List;
import java.util.Optional;

public interface OnUserQuery {



    Optional<UserQuery> findById(long id);

    Optional<UserQuery> findByIdAndUserId(long id, long userId);


    List<UserQuery> findByUserId(long userId);


    List<UserQuery> findAllUserQueryByUserAndQueryStatus(long userId,      QueryStatus queryStatus);

    List<UserQuery> findAllUserQueryByQueryStatus(QueryStatus queryStatus);
    Optional<UserQuery>findAllUserQueryByUser(long queryId,long userId, QueryStatus queryStatus);

    List<UserQuery> findByAllQuery();
}
