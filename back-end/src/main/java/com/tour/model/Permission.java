package com.tour.model;

import jakarta.annotation.Nonnull;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.checkerframework.common.aliasing.qual.Unique;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
@Entity(name = "Permission")
@Getter
@Setter
@ToString
public class Permission  implements  Comparable<Permission>{
    @Getter
    @Id
    @GenericGenerator(name="cmrSeq", strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
            parameters = {
                    @Parameter(name = "sequence_ID", value = "SEQUENCE")}
    )
    @GeneratedValue(generator = "sequence_ID")
    @Column(name = "id", nullable = false)
    private Long id;
    @NonNull @Unique
    @Size(min = 3, message = "Permission name must be 3 letters minimum")
    @NotBlank(message = "Permission name cannot be blank")
    @Column(name = "user_permission",unique = true, nullable = false)
    private String name;

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public int compareTo(@Nonnull Permission obj) {
        return this.id.compareTo(obj.id);
    }



}
