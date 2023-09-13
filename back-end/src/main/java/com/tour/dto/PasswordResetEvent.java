package com.tour.dto;

import com.tour.model.User;
import com.tour.utils.VerificationURL;

public record PasswordResetEvent(
        User user,
        VerificationURL url)
{

}


