package com.tour.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Objects;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
@Getter
@Setter
@ToString
@Table(name = "Addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;
    @NonNull private String number;
    @NonNull @Column(name = "street_name",nullable = false)
    private String streetName;
    @NonNull private @Column(nullable = false)
    String suburbs;
    @NonNull @Column(nullable = false)
    private String city;
    @NonNull @Column(nullable = false)
    private Integer postalCode;
    @NonNull @Column(nullable = false)
    private  String country;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Address address)) return false;
        return Objects.equals(number, address.number) && Objects.equals(streetName, address.streetName) && Objects.equals(suburbs, address.suburbs) && Objects.equals(city, address.city) && Objects.equals(postalCode, address.postalCode) && Objects.equals(country, address.country);
    }

    @Override
    public int hashCode() {
        return Objects.hash(number, streetName, suburbs, city, postalCode, country);
    }
}
