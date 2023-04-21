package com.Tour.model;

import jakarta.persistence.Table;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@Entity(name="UserQuery")
@Table(name = "UserQuery")
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
public class UserQuery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;
    @NonNull
    @Column(name = "query_summary", nullable = false,length = 3072)
    private String querySummary ;
    @NonNull
    @Column(name = "query_description", nullable = false,length = 3072)
    private String queryDescription;
    @NonNull
    @Column(name = "user_type")
    @Enumerated(EnumType.STRING)
    private QueryStatus queryStatus = QueryStatus.ACTIVE;
    @Column(length = 3072)
    private String response;

    @NonNull
    @Setter(value = AccessLevel.PRIVATE)
    private LocalDateTime localDateTime = LocalDateTime.now();
    @ManyToOne(fetch = FetchType.LAZY)
    @NonNull
    @ToString.Exclude
    private  User user;



}
