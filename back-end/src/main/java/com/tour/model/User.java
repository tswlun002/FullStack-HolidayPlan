package com.tour.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.Hibernate;
import org.hibernate.annotations.GenericGenerator;

import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Entity
@Getter
@Setter
@ToString
@Builder
@Table(name = "Users")
public class User{
    @Id
    @GenericGenerator(name="cmrSeq", strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
            parameters = {
                    @org.hibernate.annotations.Parameter(name = "sequence_ID", value = "SEQUENCE")}
    )
    @GeneratedValue(generator = "sequence_ID")
    @Column(name = "id", nullable = false)
    private Long id;
    @NonNull
    @Column(name = "user_name", nullable = false,unique = true)
    private  String username;
    @NonNull
    @Column(name = "first_name",nullable = false)
    private String firstname;
    @Column(name = "last_name" ,nullable=false)
    private String lastname;
     @NonNull
     @Column(nullable = false)
    private  String password;
     @Builder.Default
     private boolean  isEnabled = false;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "User_Role",
            joinColumns = {@JoinColumn(name = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "role_id")}
    )
    @Builder.Default
    private Set<Role> roles =new HashSet<>();
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "User_Permission",
            joinColumns = {@JoinColumn(name = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "permission_id")}
    )
    @Builder.Default
    private Set<Permission> permissions =new HashSet<>();
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date age;
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
