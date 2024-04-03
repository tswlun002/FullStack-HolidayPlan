package com.tour.dto;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.NonNull;
import java.util.Date;

public record RegisterUserRequest(
@NotBlank(message = "Firstname is required")
@NotEmpty(message = "Firstname is required")
@Size(min = 2, max = 50, message = "Firstname must contain 2 to 50 characters.")
String firstname,
@NonNull
@NotBlank(message = "lastname is required")
@NotEmpty(message = "lastname is required")
@Size(min = 2, max = 50, message = "lastname must contain 2 to 50 characters.")

String lastname,
@NotBlank(message = "username is required")
@NotEmpty(message = "username is required")
@Size(min = 3, max = 50, message = "Enter valid username, e.g tswlun2@gmail.com")
String username,
@JsonFormat(pattern="yyyy-MM-dd")
Date age,
@NotBlank(message = "password is required")
@NotEmpty(message = "password is required")
@Size(min = 5, max = 1000, message = "password must contain 3 to 50 characters.")
String password,
@NotEmpty(message = "usertype is required")
String usertype
) {
}
