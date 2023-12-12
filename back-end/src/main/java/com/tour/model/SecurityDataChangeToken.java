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
@Table(name = "SecurityDataChangeToken")
public class SecurityDataChangeToken {
    @Id
    @GenericGenerator(name="cmrSeq", strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
            parameters = {
                    @org.hibernate.annotations.Parameter(name = "sequence_ID", value = "SEQUENCE")}
    )
    @GeneratedValue(generator = "sequence_ID")
    @Column(name = "id", nullable = false)
    private Long id;

    @NonNull
    @Column(name = "otp")
    private Integer OTP;
    private  Boolean verified=false;
    @NonNull
    private Date expirationDate;
    @OneToOne(optional = false)
    @JoinColumns(value = {@JoinColumn(name = "user_id", referencedColumnName = "id",nullable = false),
            @JoinColumn(name = "user_name",referencedColumnName = "user_name",nullable = false)})
    private User user;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SecurityDataChangeToken that)) return false;
        return Objects.equals(getId(), that.getId()) && Objects.equals(getOTP(), that.getOTP()) &&
                Objects.equals(getVerified(), that.getVerified()) && Objects.equals(getExpirationDate(),
                that.getExpirationDate());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getOTP(), getVerified(), getExpirationDate());
    }
}
