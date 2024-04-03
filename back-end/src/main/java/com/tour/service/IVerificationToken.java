package com.tour.service;

import com.tour.model.User;
import com.tour.model.VerificationToken;
import com.tour.utils.VerificationURL;
import org.springframework.stereotype.Service;
import java.util.Optional;
@Service
public interface IVerificationToken {


    VerificationToken   saveToken(User user);

    Optional<VerificationToken> findByToken(String token);
    Optional<VerificationToken> findByUserId(Long userId);

    boolean deleteToken(String token);

    boolean verifyToken(VerificationToken token1, VerificationURL url);
}
