package com.tour.exception;

import lombok.*;
import java.time.LocalDateTime;
import java.util.Map;
@Builder
@Getter
@AllArgsConstructor
@Data
@ToString
public class ErrorDetails {
    private LocalDateTime date;
    private String message;
    String path;
}

