package com.tour.security;
import lombok.Builder;


@Builder
public record AuthenticationRequest(String username, String password) {
}
