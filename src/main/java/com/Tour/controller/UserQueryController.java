package com.Tour.controller;

import com.Tour.exception.CatchException;
import com.Tour.exception.NotFoundException;
import com.Tour.model.QueryStatus;
import com.Tour.model.UserQuery;
import com.Tour.service.OnUser;
import com.Tour.service.QueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin( origins = "*",originPatterns = "http://localhost:3000/**")
@RequestMapping("/holiday-plan/api/user-query/")
public class UserQueryController   {

    @Autowired
    private QueryService queryService;
    @Autowired private OnUser onUser;

    @PostMapping(value = "query/save/")
    public  ResponseEntity<UserQuery>saveQuery(@RequestBody @Validated QueryRequest queryRequest){
        UserQuery userQuery  = null;
        try {
                userQuery=UserQuery.builder().queryDescription(queryRequest.getQueryDescription()).
                    querySummary(queryRequest.getQuerySummary()).queryStatus(QueryStatus.ACTIVE).
                    localDateTime(LocalDateTime.now()).user(onUser.getLoginedUser()).build();
        }catch (Exception e){
            CatchException.catchException(e);
        }
        if(userQuery==null) CatchException.catchException(new NullPointerException("Invalid query"));

        var query  =queryService.saveQuery(userQuery);

        return query.map(value ->
                new ResponseEntity<>(value, HttpStatus.OK)).
                orElseGet(() -> new ResponseEntity<>(null, HttpStatus.NOT_ACCEPTABLE));
    }
    @PatchMapping(value = "query/update/")
    public ResponseEntity<UserQuery> updateQuery(@RequestParam String username,@RequestParam long queryId,@RequestBody UserQuery userQuery){
        System.out.println(userQuery);
        var queries = queryService.updateQuery(username,queryId,userQuery);
        return queries.map(query->new ResponseEntity<>(query, HttpStatus.OK)).
                orElseGet(()-> new ResponseEntity<>(null, HttpStatus.NOT_ACCEPTABLE));
    }
    @GetMapping(value="query/user/logged-in/")
    public ResponseEntity<List<UserQuery>> getQueryLoggedInUser() {
        var query=  queryService.loggedInUserQuery();
        if(query.isEmpty())throw  new NotFoundException("Query is not found");
        return new ResponseEntity<>(query, HttpStatus.OK);
    }

    @GetMapping(value="query/user/logged-in/status/")
    public ResponseEntity<List<UserQuery>> getQueryLoggedInUser(@RequestParam QueryStatus queryStatus) {
        var query=  queryService.loggedInUserQuery(queryStatus);
        if(query.isEmpty())throw  new NotFoundException("Query is not found");
        return new ResponseEntity<>(query, HttpStatus.FOUND);
    }
    @GetMapping(value="query/{id}")
    public ResponseEntity<Optional<UserQuery>> findById(@PathVariable long queryId) {
        var query=  queryService.findById(queryId);
        if(query.isEmpty())throw  new NotFoundException("Query is not found");

        return new ResponseEntity<>(query, HttpStatus.FOUND);
    }
    @GetMapping(value = "query/user/")
    public  ResponseEntity<Optional<UserQuery>> findByIdAndUserId(@RequestParam long queryId, @RequestParam long userId) {
        var query=  queryService.findByIdAndUserId(queryId, userId);
        if(query.isEmpty())throw  new NotFoundException("Query is not found");

        return new ResponseEntity<>(query, HttpStatus.FOUND);
    }

    @GetMapping(value = "query/user/{userId}")
    public ResponseEntity<List<UserQuery>> getQueryByUserId(@PathVariable long userId) {
        var queries  = queryService.findByUserId(userId);
        if(queries.isEmpty())throw  new NotFoundException("No queries  found ");
        return  new ResponseEntity<>(queries, HttpStatus.FOUND);
    }

    @GetMapping(value = "query/user/status/")
    public ResponseEntity<List<UserQuery>> getUserQueriesByUserAndQueryStatus(@RequestParam long userId, @RequestParam QueryStatus queryStatus) {
        var queries  = queryService.findAllUserQueryByUserAndQueryStatus(userId,queryStatus);
        if(queries.isEmpty())throw  new NotFoundException("No queries  found ");
        return  new ResponseEntity<>(queries, HttpStatus.FOUND);
    }

    @GetMapping(value = "query/status/")
    public ResponseEntity<List<UserQuery>> getQueriesByQueryStatus(@RequestParam QueryStatus queryStatus) {

        var queries  = queryService.findAllUserQueryByQueryStatus(queryStatus);
        if(queries.isEmpty())throw  new NotFoundException("No queries  found ");
        return  new ResponseEntity<>(queries, HttpStatus.OK);
    }
    @GetMapping(value = "query/user/active/")
    public ResponseEntity<Optional<UserQuery>> getUserQueryByUserAndStatus(@RequestParam  long queryId,@RequestParam long userId,@RequestParam QueryStatus queryStatus){
        var  query = queryService.findAllUserQueryByUser(queryId,userId,queryStatus);
        if(query.isEmpty()) throw new NotFoundException("Query is not found");
        return  new ResponseEntity<>(query, HttpStatus.FOUND);
    }

    @GetMapping(value = "queries/all/")
    public ResponseEntity<List<UserQuery>> getQueryOfLoggedInUser() {
        var queries  = queryService.findByAllQuery();
        if(queries.isEmpty())throw  new NotFoundException("No queries  found ");
        return  new ResponseEntity<>(queries, HttpStatus.OK);
    }

   @DeleteMapping(value = "query/delete/{queryId}")
    public  ResponseEntity<Boolean> deleteUserQuery(@PathVariable long queryId){
        return queryService.deleteUserQuery(queryId)?
                new ResponseEntity<>(true, HttpStatus.OK):
                new ResponseEntity<>(false,HttpStatus.NOT_ACCEPTABLE);

    }




}
