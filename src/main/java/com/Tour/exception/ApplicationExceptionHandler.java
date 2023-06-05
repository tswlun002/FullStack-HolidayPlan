package com.Tour.exception;
import com.Tour.service.ApplicationConstraintViolationException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.Builder;
import lombok.NonNull;
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
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Builder
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
        ErrorDetails details= ErrorDetails.builder().message(ex.getMessage()).date(LocalDateTime.now()).build();
        return  new ResponseEntity<>(details, HttpStatus.BAD_REQUEST);
    }
    @Override
    protected ResponseEntity<Object> handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException ex,
                                                                         @NonNull HttpHeaders headers,
                                                                         @NonNull HttpStatusCode status,
                                                                         @NonNull WebRequest request) {
        //pageNotFoundLogger.warn(ex.getMessage());
        ErrorDetails details = ErrorDetails.builder().message(ex.getMethod()+":"+ex.getMessage())
                .date(LocalDateTime.now()).build();
        return  new ResponseEntity<>(details, HttpStatus.METHOD_NOT_ALLOWED);
    }

    @ExceptionHandler(value={com.Tour.exception.TimeoutException.class})
    public  ResponseEntity<Object> timeoutException(com.Tour.exception.TimeoutException ex,
                                                    WebRequest request){
        ErrorDetails details = ErrorDetails.builder().message(ex.getMessage())
                .date(LocalDateTime.now()).build();
        return  new ResponseEntity<>(details, HttpStatus.GATEWAY_TIMEOUT);

    }
    @ExceptionHandler(ApplicationConstrainViolationException.class)
    public ResponseEntity<Object> constrainViolationException(
            ApplicationConstrainViolationException ex, WebRequest request){


        ErrorDetails details = ErrorDetails.builder().message(ex.getConstraintViolations().toString())
                .date(LocalDateTime.now()).build();
        return  new ResponseEntity<>(details, HttpStatus.BAD_REQUEST);
    }
  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<Object> NotFoundException(
          NotFoundException ex, WebRequest request) {

       System.out.println("|||||||||||||||||||||||||||||||||||||||||||||||||||");
      ErrorDetails details = ErrorDetails.builder().message(ex.getMessage())
              .date(LocalDateTime.now()).build();
      return new ResponseEntity<>(details, HttpStatus.NOT_FOUND);
  }

    @ExceptionHandler(DuplicateException.class)
    public ResponseEntity<Object> DuplicateException(
            DuplicateException ex, WebRequest request) {


        ErrorDetails details = ErrorDetails.builder().message(ex.getMessage())
                .date(LocalDateTime.now()).build();
        return new ResponseEntity<>(details, HttpStatus.CONFLICT);
    }
    @ExceptionHandler(NullException.class)
    public ResponseEntity<Object> NullPointerException(
            NullException ex, WebRequest request) {

        ErrorDetails details = ErrorDetails.builder().message(ex.getMessage())
                .date(LocalDateTime.now()).build();
        return new ResponseEntity<>(details, HttpStatus.NOT_ACCEPTABLE);
    }

    @ExceptionHandler(value ={ApplicationConstraintViolationException.class, ConstraintViolationException.class})
    public ResponseEntity<Object> ConstraintViolationException(
            ApplicationConstraintViolationException ex, WebRequest request) throws JsonProcessingException {

        ErrorDetails details = ErrorDetails.builder().message(
                        new  ObjectMapper().writeValueAsString(ex.getConstraintViolations().stream().map(ConstraintViolation::getMessage).collect(Collectors.toSet())))

                .date(LocalDateTime.now()).build();
        return new ResponseEntity<>(details, HttpStatus.CONFLICT);
    }




    @ExceptionHandler(value ={IllegalTypeException.class, IllegalArgumentException.class})
    public ResponseEntity<Object> illegalTypeException(
            IllegalTypeException ex, WebRequest request) {

        ErrorDetails details = ErrorDetails.builder().message(ex.getMessage())
                .date(LocalDateTime.now()).build();
        return new ResponseEntity<>(details, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidCredentials.class)
    public ResponseEntity<Object> InvalidCredentials(
            InvalidCredentials ex, WebRequest request) {

        ErrorDetails details = ErrorDetails.builder().message(ex.getMessage())
                .date(LocalDateTime.now()).build();
        return new ResponseEntity<>(details, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value={ApplicationExpiredJwtException.class, ExpiredJwtException.class})
    public ResponseEntity<Object> applicationExpiredJwtException(
            ApplicationExpiredJwtException ex) {

        ErrorDetails details = ErrorDetails.builder().message(ex.getMessage())
                .date(LocalDateTime.now()).build();
        return new ResponseEntity<>(details, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value={AppInternalException.class})
    public ResponseEntity<Object> appInternalException(
            ApplicationExpiredJwtException ex) {
        System.out.println("***************************************************");
        ErrorDetails details = ErrorDetails.builder().message(ex.getMessage())
                .date(LocalDateTime.now()).build();
        return new ResponseEntity<>(details, HttpStatus.INTERNAL_SERVER_ERROR);
    }


}
