package com.Tour.model;



import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.Hibernate;
import org.springframework.lang.NonNull;
import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
@Getter
@Setter
@ToString
@Table(name = "HolidayPlan")
public class HolidayPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;
    @NonNull
    @NotBlank(message = "location is required")
    @NotEmpty(message = "location is required")
    @Size(min = 1, max = 50, message = "location must contain 1 to 50 characters.")
    private  String location;
    @NonNull
    @NotBlank(message = "city is required")
    @NotEmpty(message = "city is required")
    @Size(min = 1, max = 50, message = "city must contain 1 to 50 characters.")
    private  String city;
    @NonNull
    @Column(name = "end_date", nullable = false)
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date startDate;
    @NonNull
    @Column(name = "start_date", nullable = false)
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date endDate;
    @NonNull
    @NotBlank(message = "event is required")
    @NotEmpty(message = "event is required")
    @Size(min = 1, max = 50, message = "event must contain 1 to 50 characters.")
    private  String  event;
    @NonNull
    @NotBlank(message = "description is required")
    @NotEmpty(message = "description is required")
    @Size(min = 10, max = 1000, message = "description must contain 10 to 50 characters.")
    private String description;

    /*@JsonManagedReference
    @OneToMany(mappedBy = "holidayPlan", fetch = FetchType.EAGER, cascade = CascadeType.PERSIST, orphanRemoval = true)
    private Set<HolidayLocationImages> images = new HashSet<>();*/
    @NonNull
    @Column(name = "priority_level", nullable = false)
    private int priorityLevel;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "tourist_id")
    private User user;
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        HolidayPlan that = (HolidayPlan) o;
        return id != null && Objects.equals(id, that.id) ;
    }
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
