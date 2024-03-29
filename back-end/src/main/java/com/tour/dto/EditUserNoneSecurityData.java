package com.tour.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.NonNull;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;


public record EditUserNoneSecurityData(

    @NotBlank(message = "userName is required")
    @NotEmpty(message = "userName is required")
    @Size(min = 3, max = 50, message = "userName must contain 3 to 50 characters.")
    String firstname,
    @NotBlank(message = "firstName is required")
    @NotEmpty(message = "firstName is required")
    @Size(min = 3, max = 50, message = "firstName must contain 3 to 50 characters.")
    String lastname,

    @JsonFormat(pattern="yyyy-MM-dd") Date age,
    @NotBlank(message = "lastName is required")
    @NotEmpty(message = "lastName is required")
    @Size(min = 3, max = 50, message = "lastName must contain 3 to 50 characters.")
    String currentUsername
 ){

}


