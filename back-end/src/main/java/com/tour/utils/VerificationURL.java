package com.tour.utils;
import lombok.RequiredArgsConstructor;
@RequiredArgsConstructor
public class VerificationURL {
    private final String server;
    private final int port;
    private final String context;
    @Override
    public String toString() {
        return "http://localhost"+":"+port+context+"/holiday-plan/api/";
    }
}
