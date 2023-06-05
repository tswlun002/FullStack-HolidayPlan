package com.Tour.controller;

import com.Tour.dto.QueryRequest;
import com.Tour.exception.CatchException;
import com.Tour.exception.NotFoundException;
import com.Tour.model.QueryStatus;
import com.Tour.model.UserQuery;
import com.Tour.service.OnUser;
import com.Tour.service.QueryService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin( origins = "*",originPatterns = "http://localhost:3000/**")
@RequestMapping("/holiday-plan/api/user-query/")
@AllArgsConstructor
public class QueryController {


    private final QueryService queryService;
    private final OnUser onUser;

    @PostMapping(value = "query/save/")
    public  ResponseEntity<Boolean>saveQuery(@RequestBody @Validated QueryRequest queryRequest){
        UserQuery userQuery  = null;
        try {
                userQuery=UserQuery.builder().queryDescription(queryRequest.queryDescription()).
                    querySummary(queryRequest.querySummary()).queryStatus(QueryStatus.ACTIVE).
                    localDateTime(LocalDateTime.now()).user(onUser.getLoginedUser()).build();
        }catch (Exception e){
            CatchException.catchException(e);
        }
        if(userQuery==null) CatchException.catchException(new NullPointerException("Invalid query"));

        var saved  =queryService.saveQuery(userQuery);

        return saved?
                new ResponseEntity<>(true, HttpStatus.OK):
                new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE);
    }
    @PatchMapping(value = "query/update/")
    public ResponseEntity<Boolean> updateQuery(@RequestParam String username,@RequestParam long queryId,
                                                 @RequestParam String response,@RequestParam QueryStatus status){
        var updated = queryService.updateQuery(username,queryId,response,status);
        return updated?new ResponseEntity<>(true, HttpStatus.OK):
               new ResponseEntity<>(false, HttpStatus.NOT_ACCEPTABLE);
    }
    @GetMapping(value="query/user/logged-in/")
    public ResponseEntity<List<UserQuery>> getQueryLoggedInUser() {
        var query=  queryService.getQueryOfLoggedInUser();
        if(query.isEmpty())throw  new NotFoundException("Query is not found");
        return new ResponseEntity<>(query, HttpStatus.OK);
    }

    @GetMapping(value="query/user/logged-in/status/")
    public ResponseEntity<List<UserQuery>> getQueryLoggedInUser(@RequestParam QueryStatus queryStatus) {
        var query=  queryService.getQueryOfLoggedInUser(queryStatus);
        if(query.isEmpty())throw  new NotFoundException("Query is not found");
        return new ResponseEntity<>(query, HttpStatus.FOUND);
    }
    @GetMapping(value = "query/status/")
    public ResponseEntity<List<UserQuery>> getQueriesByStatus(@RequestParam QueryStatus queryStatus) {

        var queries  = queryService.findQueryByStatus(queryStatus);
        if(queries.isEmpty())throw  new NotFoundException("No queries  found ");
        return  new ResponseEntity<>(queries, HttpStatus.OK);
    }
    @GetMapping(value = "query/user/active/")
    public ResponseEntity<List<UserQuery>> getQueryByUserAndStatus(@RequestParam String username,@RequestParam QueryStatus queryStatus){
        var  query = queryService.getQueryByUserAndStatus(username,queryStatus);
        if(query.isEmpty()) throw new NotFoundException("Query is not found");
        return  new ResponseEntity<>(query, HttpStatus.OK);
    }

    @GetMapping(value = "queries/all/")
    public ResponseEntity<List<UserQuery>> getQueryOfLoggedInUser() {
        var queries  = queryService.findByAllQuery();
        if(queries.isEmpty())throw  new NotFoundException("No queries  found ");
        return  new ResponseEntity<>(queries, HttpStatus.OK);
    }

   @DeleteMapping(value = "query/delete/{queryId}")
    public  ResponseEntity<Boolean> deleteUserQuery(@PathVariable long queryId){
        return queryService.deleteQueryOfLoggedInUser(queryId)?
                new ResponseEntity<>(true, HttpStatus.OK):
                new ResponseEntity<>(false,HttpStatus.NOT_ACCEPTABLE);

    }
}
