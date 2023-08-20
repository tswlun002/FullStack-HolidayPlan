package com.tour.dto;

import jakarta.persistence.Column;
import lombok.NonNull;

public record AddressDTO(
        @NonNull  String number,
        @NonNull
        String streetName,
        @NonNull
        String suburbs,
        @NonNull
         String city,
        @NonNull
         Integer postalCode,
        @NonNull  String country
) {
}
