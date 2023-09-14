package com.tour.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.Date;
import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Entity
@Getter
@Setter
@ToString
@Builder
@Table(name = "Verification_Tokens")
public class VerificationToken {

    @Id
    @GenericGenerator(name="cmrSeq", strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
            parameters = {
                    @org.hibernate.annotations.Parameter(name = "sequence_ID", value = "SEQUENCE")}
    )
    @GeneratedValue(generator = "sequence_ID")
    @Column(name = "id", nullable = false)
    private Long id;
    @Column(nullable = false)
    @NonNull
    private String token;
    private  Boolean isVerified=false;
    private Date expirationDate;
    @OneToOne(optional = false)
    @JoinColumn(name = "user_id",nullable = false)
    private User user;
    public void setId(Long id) {
        this.id = id;
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof VerificationToken that)) return false;
        return Objects.equals(id, that.id) && Objects.equals(token, that.token) &&
                Objects.equals(expirationDate, that.expirationDate)&&
                Objects.equals(isVerified, that.isVerified);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, token,expirationDate, isVerified);
    }
}
