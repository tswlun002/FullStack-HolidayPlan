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
@Table(name = "SecurityQuestionAnswer")
public class SecurityQuestionAnswer {
    @Id
    @GenericGenerator(name="cmrSeq", strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
            parameters = {
                    @org.hibernate.annotations.Parameter(name = "sequence_ID", value = "SEQUENCE")}
    )
    @GeneratedValue(generator = "sequence_ID")
    @Column(name = "id", nullable = false)
    private Long id;
    private  String answer;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id",referencedColumnName = "id")
    private  SecurityQuestion question;
    @NonNull
    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "user_id",referencedColumnName = "id")
    private  User user;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SecurityQuestionAnswer that)) return false;
        return Objects.equals(getId(), that.getId()) && Objects.equals(getAnswer(), that.getAnswer()) &&
                Objects.equals(getQuestion(), that.getQuestion()) && Objects.equals(getUser(), that.getUser());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getAnswer(), getQuestion(), getUser());
    }
}
