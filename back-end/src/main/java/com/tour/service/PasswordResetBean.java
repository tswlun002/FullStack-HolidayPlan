package com.tour.service;
import lombok.*;

@Setter
@Getter
@ToString
@Builder
public class PasswordResetBean {
        private String newPassword;
        private String email;
}
