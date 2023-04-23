package com.Tour.model;

import jakarta.persistence.*;
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
    @Id
    @GenericGenerator(name="cmrSeq", strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
            parameters = {
                    @Parameter(name = "sequence_ID", value = "SEQUENCE")}
    )
    @GeneratedValue(generator = "sequence_ID")
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

    @Override
    public int compareTo(Permission obj) {
        if(obj==null)throw  new NullPointerException("Can not compare permission with null");
        return this.id.compareTo(obj.id);
    }


}
