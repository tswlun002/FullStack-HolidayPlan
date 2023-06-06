package com.tour.dto;

import jakarta.persistence.Column;
import lombok.*;
public record QueryRequest(
        @NonNull
        @Column(name = "query_summary", nullable = false,length = 3072)
        String querySummary ,
        @NonNull
        @Column(name = "query_description", nullable = false,length = 3072)
         String queryDescription
){}
