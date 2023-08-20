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
@Table(name = "social_networks")
public class SocialNetwork {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;
    @NonNull
    @Column(nullable = false)
    private  String username;
    @NonNull
    @Column(nullable = false)
    private  String name;
    @JoinColumn(nullable = false,name = "app_id")
    @ManyToOne(fetch = FetchType.LAZY)
    @ToString.Exclude
    private App app;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SocialNetwork that)) return false;
        return Objects.equals(username, that.username) &&Objects.equals(name, that.name)  ;
    }

    @Override
    public int hashCode() {
        return Objects.hash(username,name);
    }
}
