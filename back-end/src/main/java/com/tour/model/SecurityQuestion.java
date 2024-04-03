package com.tour.model;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Entity
@Getter
@Setter
@ToString
@Builder
@Table(name = "SecurityQuestions")
public class SecurityQuestion {
    @Id
    @GenericGenerator(name="cmrSeq", strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
            parameters = {
                    @org.hibernate.annotations.Parameter(name = "sequence_ID", value = "SEQUENCE")}
    )
    @GeneratedValue(generator = "sequence_ID")
    @Column(name = "id", nullable = false)
    private Long id;
    @NonNull
    @Column(nullable = false,unique = true)
    private  String question;
    @NonNull
    @Column(nullable = false,unique = true)
    private  Integer number;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SecurityQuestion that)) return false;
        return Objects.equals(getId(), that.getId()) && Objects.equals(getQuestion(), that.getQuestion())
                && Objects.equals(getNumber(), that.getNumber());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getQuestion(), getNumber());
    }
}
