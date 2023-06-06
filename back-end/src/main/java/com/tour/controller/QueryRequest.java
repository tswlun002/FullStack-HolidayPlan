package com.tour.controller;

import com.tour.model.QueryStatus;
import com.tour.model.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class QueryRequest {
        @NonNull
        @Column(name = "query_summary", nullable = false,length = 3072)
        private String querySummary ;
        @NonNull
        @Column(name = "query_description", nullable = false,length = 3072)
        private String queryDescription;

}
