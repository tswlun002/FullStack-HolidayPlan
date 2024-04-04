package com.tour.exception;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tour.service.ApplicationConstraintViolationException;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.HibernateException;
import org.hibernate.JDBCException;
import org.hibernate.exception.JDBCConnectionException;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.net.UnknownHostException;
import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
@Slf4j
@ControllerAdvice
public class ApplicationExceptionHandler  extends ResponseEntityExceptionHandler {

    /**
     * Handle the argument that are not valid for object
     * @param ex is the {@link MethodArgumentNotValidException }
     * @param headers  is httpHeaders of the  http request
     * @param status is HttpStatus of the http request
     * @param request is the web request itself
     * @return Details of the error with HttpStatus BAD_REQUEST
     */

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  @NonNull HttpHeaders headers,
                                                                  @NonNull HttpStatusCode status, @NonNull WebRequest request) {

        String builder=null;
        try {
           builder= new  ObjectMapper().writeValueAsString(ex.getBindingResult().getFieldErrors().stream().map(e->e.getDefaultMessage()).
              collect(Collectors.joining(", ")));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        ErrorDetails details= ErrorDetails.builder().path(request.getContextPath()).
                message(builder).date(LocalDateTime.now()).build();
        return  new ResponseEntity<>(details, HttpStatus.BAD_REQUEST);
    }
    @Override
    protected ResponseEntity<Object> handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException ex,
                                                                         @NonNull HttpHeaders headers,
                                                                         @NonNull HttpStatusCode status,
                                                                         @NonNull WebRequest request) {
        ErrorDetails details = ErrorDetails.builder().
                path(request.getContextPath()).message(ex.getMessage())
                .date(LocalDateTime.now()).build();
        return  new ResponseEntity<>(details, HttpStatus.METHOD_NOT_ALLOWED);
    }

    @ExceptionHandler(value={com.tour.exception.TimeoutException.class})
    public  ResponseEntity<Object> timeoutException(com.tour.exception.TimeoutException ex,
                                                    WebRequest request){

        ErrorDetails details = ErrorDetails.builder().
                path(request.getContextPath()).message(ex.getMessage())
                .date(LocalDateTime.now()).build();
        return  new ResponseEntity<>(details, HttpStatus.GATEWAY_TIMEOUT);

    }
    @ExceptionHandler(ApplicationConstrainViolationException.class)
    public ResponseEntity<Object> constrainViolationException(
            ApplicationConstrainViolationException ex, WebRequest request) throws JsonProcessingException {

      String builder = new  ObjectMapper().writeValueAsString(ex.getConstraintViolations().stream().map(ConstraintViolation::getMessage).
               collect(Collectors.toSet()));

       ErrorDetails details = ErrorDetails.builder().
                path(request.getContextPath()).message(builder)
                .date(LocalDateTime.now()).build();
        return  new ResponseEntity<>(details, HttpStatus.BAD_REQUEST);
    }
  @ExceptionHandler({NotFoundException.class, NoSuchElementException.class})
  public ResponseEntity<Object> NotFoundException(
          NotFoundException ex, WebRequest request) {

      ErrorDetails details = ErrorDetails.builder()
              .path(request.getContextPath()).message(ex.getMessage())
              .date(LocalDateTime.now()).build();
      return new ResponseEntity<>(details, HttpStatus.NOT_FOUND);
  }
    @ExceptionHandler(InvalidToken.class)
    public ResponseEntity<Object> invalidToken(
            InvalidToken ex, WebRequest request) {

        ErrorDetails details = ErrorDetails.builder().
                path(request.getContextPath()).message(ex.getMessage())
                .date(LocalDateTime.now()).build();
        return new ResponseEntity<>(details, HttpStatus.NOT_ACCEPTABLE);
    }

    @ExceptionHandler(DuplicateException.class)
    public ResponseEntity<Object> DuplicateException(
            DuplicateException ex, WebRequest request) {


        ErrorDetails details = ErrorDetails.builder().
                path(request.getContextPath()).message(ex.getMessage())
                .date(LocalDateTime.now()).build();
        return new ResponseEntity<>(details, HttpStatus.CONFLICT);
    }
    @ExceptionHandler(NullException.class)
    public ResponseEntity<Object> NullPointerException(
            NullException ex, WebRequest request) {

        ErrorDetails details = ErrorDetails.builder().
                path(request.getContextPath()).message(ex.getMessage())
                .date(LocalDateTime.now()).build();
        return new ResponseEntity<>(details, HttpStatus.NOT_ACCEPTABLE);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Object> ConstraintViolationException(
            ConstraintViolationException ex, WebRequest request) throws JsonProcessingException {
         var builder = new  ObjectMapper().writeValueAsString(ex.getConstraintViolations().stream().map(ConstraintViolation::getMessage).
                collect(Collectors.toSet()));
        ErrorDetails details = ErrorDetails.builder().
                path(request.getContextPath()).message(builder).date(LocalDateTime.now()).build();
        return new ResponseEntity<>(details, HttpStatus.CONFLICT);
    }




    @ExceptionHandler(value ={IllegalTypeException.class, IllegalArgumentException.class})
    public ResponseEntity<Object> illegalTypeException(
            IllegalTypeException ex, WebRequest request) {

        ErrorDetails details = ErrorDetails.builder().message(ex.getMessage())
                .path(request.getContextPath()).date(LocalDateTime.now()).build();
        return new ResponseEntity<>(details, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidCredentials.class)
    public ResponseEntity<Object> InvalidCredentials(
            InvalidCredentials ex, WebRequest request) {
        ErrorDetails details = ErrorDetails.builder().
                path(request.getContextPath()).message(ex.getMessage())
                .date(LocalDateTime.now()).build();
        return new ResponseEntity<>(details, HttpStatus.NETWORK_AUTHENTICATION_REQUIRED);
    }

    @ExceptionHandler(value={ApplicationExpiredJwtException.class, ExpiredJwtException.class})
    public ResponseEntity<Object> applicationExpiredJwtException(
            ApplicationExpiredJwtException ex,WebRequest request) {
        ErrorDetails details = ErrorDetails.builder().
                path(request.getContextPath()).message(ex.getMessage())
                .date(LocalDateTime.now()).build();
        return new ResponseEntity<>(details, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {HibernateException.class, DataAccessException.class})
    public ResponseEntity<Object>  handleDatabaseError(RuntimeException ex, HttpServletRequest request){
        log.info("<===============================Internal database error occured ============================================================>");
        ErrorDetails details = ErrorDetails.builder().
                path(request.getContextPath()).
                message("App internal error,please call/email to get help")
                .date(LocalDateTime.now()).build();
        return new ResponseEntity<>(details, HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ExceptionHandler(AppInternalException.class)
    public ResponseEntity<Object> appInternalException(
            AppInternalException ex,WebRequest request) {
        log.info("<===============================Internal  error occured ============================================================>");
        ErrorDetails details = ErrorDetails.builder().
                path(request.getContextPath()).
                message("App internal error, please check network, refresh page and try again." +
                        "If error persist please call/email to get help.")
                .date(LocalDateTime.now()).build();
        return new ResponseEntity<>(details, HttpStatus.INTERNAL_SERVER_ERROR);
    }



}
