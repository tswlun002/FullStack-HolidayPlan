package com.tour.repository;
import com.tour.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    @Query("select vt from PasswordResetToken vt inner join fetch vt.user where vt.token=:token")
    Optional<PasswordResetToken> findByToken(String token);

    @Query("select vt from PasswordResetToken vt inner join fetch vt.user u where u.id=:userId")
    Optional<PasswordResetToken> findByUserId(Long userId);
}
