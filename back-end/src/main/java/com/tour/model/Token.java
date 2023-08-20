package com.tour.model;

import com.tour.security.TokenType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.checkerframework.common.aliasing.qual.Unique;
import org.hibernate.Hibernate;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.lang.NonNull;

import java.util.Objects;

@Entity
@Table(name = "Token")
@RequiredArgsConstructor
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
@ToString
public class Token {
    @Id
    @GenericGenerator(name="cmrSeq", strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
            parameters = {
                    @org.hibernate.annotations.Parameter(name = "sequence_ID", value = "SEQUENCE")}
    )
    @GeneratedValue(generator = "sequence_ID")
    @Column(name = "id", nullable = false)
    private Long id;
    @Size(min = 50, message="Token must be at least 50 characters")
    @NotBlank(message = "Token is required. Token must be at least 50 characters")
    @NotEmpty(message = "Token is required. Token must be at least 50 characters")
    @NonNull
    @Column(unique = true, nullable = false,length = 1536, name = "token")
    @Unique
    private String token;
    @NonNull
    @Column(name = "token_type")
    @Enumerated(EnumType.STRING)
    private TokenType tokenType;
    @ManyToOne(fetch = FetchType.LAZY)
    @NonNull
    @ToString.Exclude
    @JoinColumn(nullable = false)
    private User user;
    private  boolean revoked;
    private  boolean expired;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Token token1)) return false;
        return isRevoked() == token1.isRevoked() && isExpired() == token1.isExpired() && Objects.equals(getToken(),
                token1.getToken()) && getTokenType() == token1.getTokenType();
    }

    @Override
    public int hashCode() {
        return Objects.hash(getToken(), getTokenType(), isRevoked(), isExpired());
    }
}
