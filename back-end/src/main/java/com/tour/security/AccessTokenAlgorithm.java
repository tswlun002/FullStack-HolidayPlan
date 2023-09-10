package com.tour.security;

import lombok.Getter;

@Getter
public enum AccessTokenAlgorithm {
    Bearer("Bearer");

    private final String name ;

    AccessTokenAlgorithm(String name) {
        this.name = name;
    }
}
