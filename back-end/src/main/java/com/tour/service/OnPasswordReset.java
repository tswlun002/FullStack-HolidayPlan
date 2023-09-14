package com.tour.service;

import com.tour.dto.PasswordResetRequest;
import com.tour.model.PasswordResetToken;
import com.tour.model.User;
import com.tour.utils.VerificationURL;

import java.util.Optional;

public interface OnPasswordReset {
    PasswordResetToken createToken(User user);

    void delete(PasswordResetToken token);

    Optional<PasswordResetToken > findByToken(String token);

    boolean verify(PasswordResetRequest passwordResetRequest, VerificationURL url);

    Optional<PasswordResetToken> findByUserId(Long id);
    Optional<PasswordResetToken> findByUsername(String username);
}
