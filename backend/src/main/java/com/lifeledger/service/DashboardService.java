package com.lifeledger.service;

import com.lifeledger.dto.response.DashboardResponse;

public interface DashboardService {
    DashboardResponse getDashboard(Long userId);
}
