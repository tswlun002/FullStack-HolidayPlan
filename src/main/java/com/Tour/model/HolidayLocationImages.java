package com.Tour.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.sql.Blob;

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
    @Column(length = 3072)
    private byte[] image = new byte[0];
    @JsonIgnore
    @ToString.Exclude
    @ManyToOne
    private HolidayPlan holidayPlan;
    private String imageType;
    private  String name;

}
