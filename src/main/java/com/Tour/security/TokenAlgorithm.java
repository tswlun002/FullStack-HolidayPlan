package com.Tour.security;

import lombok.Getter;

@Getter
public enum TokenAlgorithm {
    Bearer("Bearer");

    private final String name ;

    TokenAlgorithm(String name) {
        this.name = name;
    }
}
