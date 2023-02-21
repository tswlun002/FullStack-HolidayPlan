package com.Tour.model;

import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.Objects;
import java.util.Set;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
@Table(name = "User")
@Getter
@Setter
@ToString
public class User {
    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;
    @NonNull
    @Column(name = "user_name", nullable = false,unique = true)
    @NotBlank(message = "userName is required")
    @NotEmpty(message = "userName is required")
    @Size(min = 4, max = 50, message = "userName must contain 3 to 50 characters.")
    private  String userName;
    @NonNull
    @NotBlank(message = "firstName is required")
    @NotEmpty(message = "firstName is required")
    @Size(min = 3, max = 50, message = "firstName must contain 3 to 50 characters.")
    @Column(name = "first_name",nullable = false)
    private String firstName;
    @NotBlank(message = "lastName is required")
    @NotEmpty(message = "lastName is required")
    @Size(min = 3, max = 50, message = "lastName must contain 3 to 50 characters.")
    @Column(name = "last_name" ,nullable=false)
    private String lastName;
    @NotBlank(message = "password is required")
    @NotEmpty(message = "password is required")
    @Size(min = 5, max = 50, message = "password must contain 5 to 50 characters.")
    private  String password;
    @OneToMany(mappedBy = "user",fetch = FetchType.LAZY)
    private Set<Roles> roles;
    private int age;
    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        User that = (User) o;
        return id != null && Objects.equals(id, that.id) ;
    }
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }


}
