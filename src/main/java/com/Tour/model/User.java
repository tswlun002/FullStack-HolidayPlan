package com.Tour.model;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.Hibernate;


import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Entity(name = "User")
@Getter
@Setter
@ToString
@Builder
public class User   {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;
    @NonNull
    @Column(name = "user_type")
    @Enumerated(EnumType.STRING)
    private UserType userType;
    @NonNull
    @Column(name = "user_name", nullable = false,unique = true)
    private  String username;
    @NonNull
    @Column(name = "first_name",nullable = false)
    private String firstname;
    @Column(name = "last_name" ,nullable=false)
    private String lastname;
     @NonNull
     @Column(nullable = false,unique = true)
    private  String password;
    @NonNull
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST})
    @JoinTable(
            name = "User_Role",
            joinColumns = {@JoinColumn(name = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "role_id")}
    )
    private Set<Role> roles = new HashSet<>();
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

   @PostConstruct
    void toUpper(){
        userType =UserType.valueOf(userType.name().toUpperCase());
   }
}
