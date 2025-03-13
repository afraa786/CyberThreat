package com.cyberthreat.repository;

import com.cyberthreat.entity.ThreatReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDateTime;

public interface ThreatReportRepository extends JpaRepository<ThreatReport, Long> {
    List<ThreatReport> findByThreatType(String threatType);
    List<ThreatReport> findByTimestampAfter(LocalDateTime date);
    List<ThreatReport> findByThreatTypeAndTimestampAfter(String threatType, LocalDateTime timestamp);
}