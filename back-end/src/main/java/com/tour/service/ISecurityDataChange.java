package com.tour.service;
import com.tour.dto.SecurityChangeDataEvent;
import com.tour.model.SecurityDataChangeToken;
import com.tour.model.User;
import org.springframework.stereotype.Service;
import java.util.Optional;
@Service
public interface ISecurityDataChange {
    SecurityDataChangeToken createToken(User user);

    void delete(SecurityDataChangeToken token);

    Optional<SecurityDataChangeToken> findByOTP(int OTP);

    boolean verify(int OTP, String username, SecurityChangeDataEvent event);

    Optional<SecurityDataChangeToken> findByUserId(Long id);
    Optional<SecurityDataChangeToken> findByUsername(String username);
}
