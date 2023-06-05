package com.Tour.service;

import com.Tour.model.QueryStatus;
import com.Tour.model.UserQuery;


import java.util.List;

public interface OnUserQuery {

    List<UserQuery> findByUsername(String username);

    List<UserQuery> findQueryByStatus(QueryStatus queryStatus);
    List<UserQuery> findByAllQuery();

    List<UserQuery> getQueryByUserAndStatus(String username, QueryStatus queryStatus);
}
