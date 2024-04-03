package com.tour.repository;
import com.tour.model.SecurityDataChangeToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<SecurityDataChangeToken, Long> {
    @Query("select vt from SecurityDataChangeToken vt inner join fetch vt.user where vt.OTP=:OTP")
    Optional<SecurityDataChangeToken> findByOTP(int OTP);

    @Query(value = "select * from SecurityDataChangeToken v where v.user_id=:userId",nativeQuery = true)
    Optional<SecurityDataChangeToken> getByUserId(@Param("userId") long userId);
    @Query("select vt from SecurityDataChangeToken vt inner join fetch vt.user u where u.username=:username")
    Optional<SecurityDataChangeToken> findByUsername(String username);
}
