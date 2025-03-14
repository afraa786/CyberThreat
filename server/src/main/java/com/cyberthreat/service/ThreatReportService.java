package com.cyberthreat.service;

import com.cyberthreat.dto.ThreatReportDTO;
import com.cyberthreat.entity.ThreatReport;
import com.cyberthreat.repository.ThreatReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ThreatReportService {

    @Autowired
    private ThreatReportRepository repository;

    public ThreatReport submitReport(ThreatReportDTO reportDTO, Long reporterId) {
        ThreatReport report = new ThreatReport();
        report.setUrl(reportDTO.getUrl());
        report.setThreatType(reportDTO.getThreatType());
        report.setDescription(reportDTO.getDescription());
        report.setReporterId(reporterId);
        return repository.save(report);
    }

    public List<ThreatReport> getReports(String threatType, LocalDateTime date) {
        if (threatType != null && date != null) {
            return repository.findByThreatTypeAndTimestampAfter(threatType, date);
        } else if (threatType != null) {
            return repository.findByThreatType(threatType);
        } else if (date != null) {
            return repository.findByTimestampAfter(date);
        }
        return repository.findAll();
    }
}
