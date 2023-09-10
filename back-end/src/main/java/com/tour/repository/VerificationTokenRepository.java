package com.tour.repository;

import com.tour.model.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken , Long> {
    @Query("select vt from VerificationToken vt inner join fetch vt.user where vt.token=:token")
    Optional<VerificationToken> findByToken(String token);
}
