package com.Tour.service;

import com.Tour.model.QueryStatus;
import com.Tour.model.UserQuery;


import java.util.List;
<<<<<<< HEAD

public interface OnUserQuery {

    List<UserQuery> findByUsername(String username);

    List<UserQuery> findQueryByStatus(QueryStatus queryStatus);
    List<UserQuery> findByAllQuery();

    List<UserQuery> getQueryByUserAndStatus(String username, QueryStatus queryStatus);
=======
import java.util.Optional;

public interface OnUserQuery {



    Optional<UserQuery> findById(long id);

    Optional<UserQuery> findByIdAndUserId(long id, long userId);


    List<UserQuery> findByUserId(long userId);


    List<UserQuery> findAllUserQueryByUserAndQueryStatus(long userId,      QueryStatus queryStatus);

    List<UserQuery> findAllUserQueryByQueryStatus(QueryStatus queryStatus);
    Optional<UserQuery>findAllUserQueryByUser(long queryId,long userId, QueryStatus queryStatus);

    List<UserQuery> findByAllQuery();
>>>>>>> 7b2db3b323bebdbcb7585a6150e7667b7744d5e7
}
