// package com.cyberthreat.controller;

// import com.cyberthreat.dto.ThreatReportDTO;
// import com.cyberthreat.entity.ThreatReport;
// import com.cyberthreat.service.ThreatReportService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.time.LocalDateTime;
// import java.util.List;

// @RestController
// @RequestMapping("/api/reports")
// public class ThreatReportController {

//     @Autowired
//     private ThreatReportService service;

//     @PostMapping
//     public ResponseEntity<ThreatReport> submitReport(@RequestBody ThreatReportDTO reportDTO, @RequestParam Long reporterId) {
//         return ResponseEntity.ok(service.submitReport(reportDTO, reporterId));
//     }

//     @GetMapping
//     public ResponseEntity<List<ThreatReport>> getReports(
//             @RequestParam(required = false) String threatType,
//             @RequestParam(required = false) LocalDateTime date) {
//         return ResponseEntity.ok(service.getReports(threatType, date));
//     }
// }