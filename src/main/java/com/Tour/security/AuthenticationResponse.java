package com.Tour.security;
import lombok.Builder;

import java.util.Map;

@Builder
public record AuthenticationResponse(Map<String,String> tokens) {



}
