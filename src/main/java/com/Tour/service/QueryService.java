package com.Tour.service;

import com.Tour.exception.CatchException;
import com.Tour.exception.NotFoundException;
import com.Tour.model.QueryStatus;
import com.Tour.model.User;
import com.Tour.model.UserQuery;
import com.Tour.repository.UserQueryRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@RequiredArgsConstructor
public class QueryService  implements OnUserQuery{

    @Autowired
    private UserQueryRepository userQueryRepository;
    @Autowired
    private OnUser onUser;

    @Autowired
    private ApplicationEventPublisher publisher;


    @Override
    public  Optional<UserQuery> findById(long id) {
        return userQueryRepository.findById(id);
    }

    @Override
    public Optional<UserQuery> findByIdAndUserId(long id, long userId) {
        var user =  onUser.getUser(userId);
        if(user==null) throw  new NotFoundException("User not found");
        return userQueryRepository.findByIdAndUserId(id,user.getId());
    }

    public List<UserQuery> loggedInUserQuery() {
        var user =  onUser.getLoginedUser();
        if(user==null) throw  new NotFoundException("User not found");
        return userQueryRepository.findByUserId(user.getId());
    }

    public List<UserQuery> loggedInUserQuery(QueryStatus status) {
        var user =  onUser.getLoginedUser();
        if(user==null) throw  new NotFoundException("User not found");
        return userQueryRepository.findAllUserQueryByUserAndQueryStatus(user.getId(),status);
    }
    @Override
    public List<UserQuery> findByUserId(long userId) {
        var user =  onUser.getUser(userId);
        if(user==null) throw  new NotFoundException("User not found");
        return userQueryRepository.findByUserId(user.getId());
    }

    @Override
    public Optional<UserQuery>findAllUserQueryByUser(long queryId, long userId, QueryStatus queryStatus) {
        var user =  onUser.getUser(userId);
        if(user==null) throw  new NotFoundException("User not found");
        return userQueryRepository.findAllValidUserQueryByUser(queryId, userId,queryStatus);

    }
    @Override
    public List<UserQuery> findAllUserQueryByUserAndQueryStatus(long userId, QueryStatus queryStatus) {
        var user =  onUser.getUser(userId);
        if(user==null) throw  new NotFoundException("User not found");
        return userQueryRepository.findAllUserQueryByUserAndQueryStatus(user.getId(),queryStatus);
    }


    @Override
    public List<UserQuery> findAllUserQueryByQueryStatus(QueryStatus queryStatus) {
        return userQueryRepository.findAllUserQueryByQueryStatus(queryStatus);
    }

    @Override
    public List<UserQuery> findByAllQuery() {
        return userQueryRepository.findByAllQuery();
    }

    public Optional<UserQuery> saveQuery(UserQuery userQuery) {
        UserQuery userQuery1=null;
        try {
            userQuery1 = userQueryRepository.save(userQuery);
        }catch (Exception e){
            CatchException.catchException(e);

        }
        if(userQuery1==null)throw  new NullPointerException("Query is invalid");

        return Optional.of(userQuery1);

    }
    public Optional<UserQuery> updateQuery(String username,long queryId,UserQuery userQuery){
        var user = onUser.getUser(username);
        if(user==null) throw  new NotFoundException("User is not found");
        var query = userQueryRepository.findByIdAndUserId(queryId,user.getId());
        if(query.isEmpty()) throw  new NotFoundException("Query is not found");
        if(userQuery.getQuerySummary()!=null) query.get().setQuerySummary(userQuery.getQuerySummary());
        if(userQuery.getQueryDescription()!=null) query.get().setQueryDescription(userQuery.getQueryDescription());
        if(userQuery.getQueryStatus()!=null) query.get().setQueryStatus(userQuery.getQueryStatus());
        if(userQuery.getResponse()!=null) query.get().setResponse(userQuery.getResponse());
        var updatedQuery = userQueryRepository.save(query.get());
        //publisher.publishEvent(new UserEvent(user));
        return  Optional.of(updatedQuery);
    }

    public  boolean  deleteQuery(long queryId){
        var query = userQueryRepository.findById(queryId);
        if(query.isEmpty()) throw new NotFoundException("Query is not found");
        boolean isDeleted = false;
        try {
            userQueryRepository.delete(query.get());
            isDeleted=true;
        }catch(Exception e){
            CatchException.catchException(e);
        }
        return  isDeleted;
    }

    public  boolean deleteAllQuery(){
        var queries = userQueryRepository.findByAllQuery();
        if(queries.isEmpty())throw  new NotFoundException("No query");
        boolean isDeleted = false;
        try {
            queries.forEach(query->userQueryRepository.delete(query));;
            isDeleted=true;
        }catch(Exception e){
            CatchException.catchException(e);
        }
        return  isDeleted;
    }
    public  void deleteUserQueries(User user){
        if(user==null)throw new NullPointerException("Invalid user");
        try {
            findByUserId(user.getId()).forEach(userQuery -> userQueryRepository.delete(userQuery));
        }catch(Exception e){
            CatchException.catchException(e);
        }


    }
    public  boolean deleteUserQuery(long queryId){
          var user  = onUser.getLoginedUser();
          var queries  = findByUserId(user.getId());
        if(queries.size()==0) throw  new NotFoundException("User does not query.");

        var query  = queries.stream().filter(query1-> query1.getId()==queryId);

        if(query.toList().size()==0) throw  new NotFoundException("Query is not found.");

        boolean isDeleted = false;
        try {
             userQueryRepository.deleteById(queryId);
            isDeleted=true;
        }catch(Exception e){
            CatchException.catchException(e);
        }
        return  isDeleted;
    }




}
