package com.tour.dto;
import jakarta.persistence.Lob;
import jakarta.validation.constraints.Email;
import lombok.NonNull;

public record AppDTO(
       @NonNull String name,
        @NonNull
        @Lob  String logo,
        @NonNull
         String about,
        @NonNull
        @Email
        String email,
        @NonNull
        String phone
){
}
