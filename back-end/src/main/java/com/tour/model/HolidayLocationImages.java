package com.tour.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

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
    @Column(columnDefinition = "LONGBLOB")
    private byte[] image = new byte[777215];
    @JsonIgnore
    @ToString.Exclude
    @ManyToOne
    private HolidayPlan holidayPlan;
    private String imageType;
    private  String name;

}
