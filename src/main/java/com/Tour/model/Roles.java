package com.Tour.model;

import com.Tour.security.UserRole;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
@ToString
@Getter
@Setter
@Entity(name = "Role")
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
public class Roles {
    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;
    @NotEmpty(message = "Name is required")
    @NotBlank(message = "Name is required")
    @Enumerated(EnumType.STRING)
    private UserRole role;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
