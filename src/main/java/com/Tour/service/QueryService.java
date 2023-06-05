package com.Tour.service;

import com.Tour.exception.CatchException;
import com.Tour.exception.NotFoundException;
import com.Tour.exception.NullException;
import com.Tour.model.QueryStatus;
import com.Tour.model.User;
import com.Tour.model.UserQuery;
import com.Tour.repository.UserQueryRepository;
import lombok.AllArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
@AllArgsConstructor

public class QueryService  implements OnUserQuery{
    private final UserQueryRepository queryRepository;
    private final OnUser onUser;
    private final ApplicationEventPublisher publisher;

    /**
     * Save  query
     * @param query is the query to save
     * @return Optional query  if saved successfully
     * @throws  NullException if the given query is null
     */
    public boolean saveQuery(UserQuery query) {
        if(query==null) throw  new NullException("Cannot save null query");
        var saved  =false;
        try {
           queryRepository.save(query);
            saved=true;
        }catch (Exception e){
            CatchException.catchException(e);
        }
        return saved;
    }

    /**
     * Update query response and status
     * @param username of the user
     * @param queryId of the query to update
     * @param response is the new response of the query
     * @param status  is the new status of the  query
     * @return  Query with updated information
     * @throws  NotFoundException if user or  query is not found
     */
    public boolean updateQuery(String username,Long queryId,
                                           String response,QueryStatus status){
        var user = onUser.getUser(username);
        if(user==null) throw  new NotFoundException("User is not found");
        var query = queryRepository.findByIdAndUserId(queryId,user.getId());
        if(query.isEmpty()) throw  new NotFoundException("Query is not found");
        var updated =false;
        if(status!=null) query.get().setQueryStatus(status);
        if(response!=null && !(response.isEmpty() && response.isBlank())) query.get().setResponse(response);
        try{
            queryRepository.save(query.get());
            updated=true;
        }catch (Exception e){
            CatchException.catchException(e);
        }
        return  updated;
    }

    /**
     * Get queries of the logged-in user
     * @return List queries
     * @throws  NotFoundException if no logged-in user
     */
    public List<UserQuery> getQueryOfLoggedInUser() {
        var user =  onUser.getLoginedUser();
        if(user==null) throw  new NotFoundException("User not found");
        return findByUsername(user.getUsername());
    }

    /**
     * Get queries of logged-in user by status
     * @param status (ACTIVE|SOLVED) of the query
     * @return List of query
     * @throws  NotFoundException if no logged-in user
     */
    public List<UserQuery> getQueryOfLoggedInUser(QueryStatus status) {
        var user =  onUser.getLoginedUser();
        if(user==null) throw  new NotFoundException("User not found");
        return getQueryByUserAndStatus(user.getUsername(),status);
    }

    /**
     * Retrieve queries by username
     * @param username  of the user
     * @return List of query
     */
    @Override
    public List<UserQuery> findByUsername(String username) {
        return queryRepository.findByusername(username);
    }

    /**
     * Retrieve query by status
     * @param queryStatus (ACTIVE | SOLVED) of the query
     * @return List query
     */
    @Override
    public List<UserQuery> findQueryByStatus(QueryStatus queryStatus) {
        return queryRepository.findAllUserQueryByQueryStatus(queryStatus);
    }

    /**
     * Retrieve all query
     * @return List of query
     */
    @Override
    public List<UserQuery> findByAllQuery() {
        return queryRepository.findByAllQuery();
    }

    /**
     * Retrieve query by username and status
     * @param username of the user
     * @param queryStatus of the status
     * @return List of query
     */
    @Override
    public List<UserQuery> getQueryByUserAndStatus(String username, QueryStatus queryStatus) {
         return  queryRepository.getQueryByUserAndStatus(username,queryStatus);
    }

    /**
     * Delete query
     * @param queryId of the query  to delete
     * @return true if the query is deleted else false
     */
    public  boolean  deleteQuery(long queryId){
        var query = queryRepository.findById(queryId);
        if(query.isEmpty()) throw new NotFoundException("Query is not found");
        boolean isDeleted = false;
        try {
            queryRepository.delete(query.get());
            isDeleted=true;
        }catch(Exception e){
            CatchException.catchException(e);
        }
        return  isDeleted;
    }

    /**
     * Delete all query
     * @return true if all query are deleted else false
     */
    public  boolean deleteAllQuery(){
        var queries = queryRepository.findByAllQuery();
        if(queries.isEmpty())throw  new NotFoundException("No query");
        boolean isDeleted = false;
        try {
            queries.forEach(queryRepository::delete);;
            isDeleted=true;
        }catch(Exception e){
            CatchException.catchException(e);
        }
        return  isDeleted;
    }

    /**
     * Delete query of the user
     * @param user is the to delete its queries
     * @throws  NullException if the user null
     */
    public  void deleteUserQueries(User user){
        if(user==null)throw new NullPointerException("Cannot delete query of null user");
        try {
            findByUsername(user.getUsername()).forEach(queryRepository::delete);
        }catch(Exception e){
            CatchException.catchException(e);
        }
    }

    /**
     * Delete query  of the logged-in user
     * @param queryId of the query to delete
     * @return true if query deleted else false
     */
    public  boolean deleteQueryOfLoggedInUser(long queryId){
        var user  = onUser.getLoginedUser();
        if(user==null)throw new NullPointerException("Cannot delete query of null user");
        boolean isDeleted = false;
         var query  = findByUsername(user.getUsername()).stream().
                 filter(query1->query1.getId()==queryId).toList();

         if(query.isEmpty())return false;

         try {
             queryRepository.deleteAll(query);
             isDeleted=true;
         }catch (Exception e){
             CatchException.catchException(e);
         }
        return  isDeleted;
    }
}
