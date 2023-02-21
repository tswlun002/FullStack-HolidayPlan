package com.Tour.exception;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

@ControllerAdvice
@Builder
@NoArgsConstructor
public class ApplicationExceptionHandler extends ResponseEntityExceptionHandler {
    /**
     * Handle the argument that are not valid for object
     * @param ex is the {@link MethodArgumentNotValidException }
     * @param httpHeaders  is httpHeaders of the  http request
     * @param status is HttpStatus of the http request
     * @param request is the web request itself
     * @return Details of the error with HttpStatus BAD_REQUEST
     */
    @Override
    public @NonNull ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                        @NonNull HttpHeaders httpHeaders,
                                                                        @NonNull HttpStatus status, @NonNull WebRequest request){
        ErrorDetails details= ErrorDetails.builder().message(ex.getFieldErrors().toString()).date(LocalDateTime.now()).build();

        return  new ResponseEntity<>(details, HttpStatus.BAD_REQUEST);
    }

    @Override
    protected @NonNull ResponseEntity<Object> handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException ex,
                                                                                  @NonNull HttpHeaders headers,
                                                                                  @NonNull HttpStatus status,
                                                                                  @NonNull WebRequest request) {


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
        return new ResponseEntity<>(details, HttpStatus.NO_CONTENT);
    }

    @ExceptionHandler(value ={ApplicationDataIntegrityViolationException.class})
    public ResponseEntity<Object> dataIntegrityViolationException(
            ApplicationDataIntegrityViolationException ex, WebRequest request) {

        ErrorDetails details = ErrorDetails.builder().message(ex.getMessage())
                .date(LocalDateTime.now()).build();
        return new ResponseEntity<>(details, HttpStatus.BAD_REQUEST);
    }


}
