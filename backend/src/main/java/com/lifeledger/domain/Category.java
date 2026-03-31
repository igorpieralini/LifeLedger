package com.lifeledger.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "categories")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private CategoryType type = CategoryType.VARIABLE;

    @Column(length = 7)
    private String color;   // hex e.g. #FF5733

    @Column(length = 50)
    private String icon;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    private void onCreate() { createdAt = LocalDateTime.now(); }

    public enum CategoryType { FIXED, VARIABLE }
}
