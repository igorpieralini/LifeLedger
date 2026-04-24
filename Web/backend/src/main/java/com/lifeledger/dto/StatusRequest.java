package com.lifeledger.dto;

import com.lifeledger.domain.GoalStatus;
import jakarta.validation.constraints.NotNull;

public record StatusRequest(@NotNull GoalStatus status) {}
