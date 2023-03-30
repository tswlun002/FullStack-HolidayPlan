package com.Tour.model;

import jakarta.persistence.*;
import lombok.*;
import org.checkerframework.common.aliasing.qual.Unique;

@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
@Entity(name = "Permission")
@Getter
@Setter
@ToString
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;
    @NonNull @Unique
    @Column(name = "user_permission",unique = true)
    @Enumerated(EnumType.STRING)
    private UserPermission name;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
}
