package com.tour.repository;
import com.tour.model.SecurityDataChangeToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<SecurityDataChangeToken, Long> {
    @Query("select vt from SecurityDataChangeToken vt inner join fetch vt.user where vt.OTP=:OTP")
    Optional<SecurityDataChangeToken> findByOTP(int OTP);

    @Query("select vt from SecurityDataChangeToken vt inner join fetch vt.user u where u.id=:userId")
    Optional<SecurityDataChangeToken> findByUserId(Long userId);
    @Query("select vt from SecurityDataChangeToken vt inner join fetch vt.user u where u.username=:username")
    Optional<SecurityDataChangeToken> findByUsername(String username);
}
