package com.lifeledger.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "goals")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Short year;

    @Column(name = "target_value", precision = 15, scale = 2)
    private BigDecimal targetValue;

    @Column(name = "current_value", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal currentValue = BigDecimal.ZERO;

    @Column(nullable = false)
    @Builder.Default
    private Short progress = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "goal_status")
    @Builder.Default
    private GoalStatus status = GoalStatus.IN_PROGRESS;

    private LocalDate deadline;

    @OneToMany(mappedBy = "goal", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SubGoal> subGoals = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    private void onCreate() { createdAt = updatedAt = LocalDateTime.now(); }

    @PreUpdate
    private void onUpdate() { updatedAt = LocalDateTime.now(); }

    public enum GoalStatus { IN_PROGRESS, COMPLETED, DELAYED, CANCELLED }
}
