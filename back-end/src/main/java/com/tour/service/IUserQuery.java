package com.tour.service;

import com.tour.model.QueryStatus;
import com.tour.model.UserQuery;


import java.util.List;

public interface IUserQuery {

    List<UserQuery> findByUsername(String username);

    List<UserQuery> findQueryByStatus(QueryStatus queryStatus);
    List<UserQuery> findByAllQuery();

    List<UserQuery> getQueryByUserAndStatus(String username, QueryStatus queryStatus);
}
