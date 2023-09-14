package com.tour.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import java.util.Arrays;
import java.util.Objects;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@ToString
@Table(name = "HolidayPlanImages")
public class HolidayLocationImages {
    @Id
    @GenericGenerator(name="cmrSeq", strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
            parameters = {
                    @org.hibernate.annotations.Parameter(name = "sequence_ID", value = "SEQUENCE")}
    )
    @GeneratedValue(generator = "sequence_ID")

    @Column(name = "id", nullable = false)
    private Long id;
    @Lob
    @Column(length = 16777215 )
    private byte[] image ;
    @JsonIgnore
    @ToString.Exclude
    @ManyToOne
    private HolidayPlan holidayPlan;
    private String imageType;
    private  String name;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof HolidayLocationImages that)) return false;
        return Arrays.equals(getImage(), that.getImage()) && Objects.equals(getHolidayPlan(),
                that.getHolidayPlan()) && Objects.equals(getImageType(), that.getImageType()) &&
                Objects.equals(getName(), that.getName());
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(getHolidayPlan(), getImageType(), getName());
        result = 31 * result + Arrays.hashCode(getImage());
        return result;
    }
}
