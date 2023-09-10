package com.tour.service;

import com.tour.model.VerificationToken;
import com.tour.utils.VerificationURL;
import org.springframework.stereotype.Service;
import java.util.Optional;
@Service
public interface OnVerificationToken {


    boolean   saveToken(VerificationToken token);

    Optional<VerificationToken> findByToken(String token);

    boolean deleteToken(String token);

    boolean verifyToken(VerificationToken token1, VerificationURL url);
}
