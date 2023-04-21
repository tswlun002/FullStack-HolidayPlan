package com.Tour.exception;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.Builder;
import lombok.NonNull;
import org.springframework.dao.DataIntegrityViolationException;
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



    @ExceptionHandler(value ={ApplicationDataIntegrityViolationException.class, DataIntegrityViolationException.class})
    public ResponseEntity<Object> dataIntegrityViolationException(
            ApplicationDataIntegrityViolationException ex, WebRequest request) {

        ErrorDetails details = ErrorDetails.builder().message(ex.getMessage())
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
