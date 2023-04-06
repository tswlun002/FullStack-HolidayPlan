package com.Tour.controller;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.NonNull;

public record RegisterUserRequest(
@NotBlank(message = "userName is required")
@NotEmpty(message = "userName is required")
@Size(min = 4, max = 50, message = "userName must contain 3 to 50 characters.")
String firstname,
@NonNull
@NotBlank(message = "firstName is required")
@NotEmpty(message = "firstName is required")
@Size(min = 3, max = 50, message = "firstName must contain 3 to 50 characters.")
String lastname,
@NotBlank(message = "lastName is required")
@NotEmpty(message = "lastName is required")
@Size(min = 3, max = 50, message = "lastName must contain 3 to 50 characters.")
String username,
@Min(16)
int age,
@NotBlank(message = "password is required")
@NotEmpty(message = "password is required")
@Size(min = 5, max = 1000, message = "password must contain 3 to 50 characters.")
String password,
@NotEmpty(message = "usertype is required")
String usertype) {
}